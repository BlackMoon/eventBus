using System;
using System.Net;
using DryIoc;
using Kit.Core;
using Kit.Core.CQRS.Job;
using Kit.Core.Web.Binders;
using Kit.Dal.DbManager;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Kit.Dal.Configuration;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using CacheManager.Core;
using Host.Security;
using Host.Security.TokenProvider;
using Microsoft.Extensions.Primitives;

namespace Host
{
    public partial class Startup : DryIocStartup
    {
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {
            var builder = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsEnvironment("Development"))
            {
                // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
                builder.AddApplicationInsightsSettings(developerMode: true);
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }


        // This method gets called by the runtime. Use this method to add services to the container
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddApplicationInsightsTelemetry(Configuration);
            services.AddOptions();

            services.Configure<ConnectionOptions>(Configuration.GetSection("Data:DefaultConnection"));
            services.Configure<TokenProviderOptions>(Configuration.GetSection("TokenAuthentication"));

            // for the UI
            services
                .AddMvc(options =>
                {
                    options.ModelBinderProviders.Insert(0, new EncryptModelBinderProvider());
                })
                .AddJsonOptions(option =>
                {
                    option.SerializerSettings.DefaultValueHandling = DefaultValueHandling.Ignore;                    
                    option.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    option.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                });

            services.AddRouting(options => options.LowercaseUrls = true);

            // Add secret's caching
            ICacheManagerConfiguration cacheConfiguration = Configuration.GetCacheConfiguration("secretCache");
            services.AddSingleton(p => CacheFactory.FromConfiguration<SecretItem>("secretCache", cacheConfiguration)); 

            // Add dependencies
            IContainer container = ConfigureDependencies(services, "domain", "Kit.Core", "Kit.Dal", "Kit.Dal.Postgre");

            // IDbManager
            container.RegisterDelegate(delegate (IResolver r)
            {
                HttpContext httpContext = r.Resolve<IHttpContextAccessor>().HttpContext;
                ConnectionOptions options = r.Resolve<IOptions<ConnectionOptions>>().Value;

                ClaimsPrincipal cp = httpContext.User;
                string pswd = "postgres",//cp.FindFirst(ConnectionClaimTypes.Password)?.Value,
                    userId = "postgres";// cp.Identity.Name;                       

                return $"User Id={userId};Password={pswd};Host={options.Server};Port={options.Port};Database={options.DataSource};Pooling=true;";                

            }, serviceKey: "ConnectionString");

            container.RegisterInstance(Configuration["Data:DefaultConnection:ProviderName"], serviceKey: "ProviderName");

            // глобальный dbManager
            string connStr = Configuration.GetConnectionString("AdminConnection");
            container.Register(
                reuse: Reuse.Singleton,
                made: Made.Of(() => DbManagerFactory.CreateDbManager(Arg.Of<string>("ProviderName"), connStr), requestIgnored => string.Empty),
                serviceKey: "AdminDbManager");

            // todo - check IDbManager'a initialiazation
            container.RegisterInitializer<IDbManager>((m, r) => m.Notification = (sender, args) => { }, info => Equals(info.ServiceKey, "AdminDbManager"));

            // dbManager для текущего пользователя (веб)
            container.Register(
                made: Made.Of(() => DbManagerFactory.CreateDbManager(Arg.Of<string>("ProviderName"), Arg.Of<string>("ConnectionString")), requestIgnored => string.Empty));

            // 
            container.Register<SecretStorage>(Reuse.Singleton);
            
            // Startup Jobs
            IJobDispatcher dispatcher = container.Resolve<IJobDispatcher>(IfUnresolved.ReturnDefault);
            dispatcher?.Dispatch<IStartupJob>();

            return container.Resolve<IServiceProvider>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                    context.Response.Redirect("/?returnUrl=" + context.Request.Path);
            });

            // exception handlers
            app.UseExceptionHandler(builder =>
            {
                builder.Run(async context => 
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    IExceptionHandlerFeature ex = context.Features.Get<IExceptionHandlerFeature>();
                    if (ex != null)
                    {
                        string error = JsonConvert.SerializeObject(new { ex.Error.Message });
                        await context.Response.WriteAsync(error).ConfigureAwait(false);
                    }
                });
            });

            ConfigureAuth(app);

            app.UseFileServer();
            app.UseMvc();
        }
    }
}
