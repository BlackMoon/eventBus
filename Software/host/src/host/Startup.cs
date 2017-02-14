using System;
using System.Text;
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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Host
{
    public partial class Startup : DryIocStartup
    {
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env) 
        {
            var builder = new ConfigurationBuilder()
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

            // for the UI
            services
                .AddMvc(options =>
                {
                    options.ModelBinderProviders.Insert(0, new EncryptModelBinderProvider());
                    options.CacheProfiles.Add("1hour", new CacheProfile() { Duration = 3600 });
                })
                .AddJsonOptions(option =>
                {
                    option.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                    option.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                });

            services.AddRouting(options => options.LowercaseUrls = true);

            // Add dependencies
            IContainer container = ConfigureDependencies(services, "Kit.Core", "Kit.Dal", "Kit.Dal.Postgre");

            // IDbManager
            container.RegisterInstance(Configuration.GetConnectionString("DefaultConnection"), serviceKey: "ConnectionString");
            container.RegisterInstance(Configuration["Data:DefaultConnection:ProviderName"], serviceKey: "ProviderName");
            container.Register(
                reuse: Reuse.Singleton,
                made: Made.Of(() => DbManagerFactory.CreateDbManager(Arg.Of<string>("ProviderName"), Arg.Of<string>("ConnectionString")), requestIgnored => string.Empty)
                );

            // Startup Jobs
            IJobDispatcher dispatcher = container.Resolve<IJobDispatcher>(IfUnresolved.ReturnDefault);
            dispatcher?.Dispatch<IStartupJob>();
           
            return container.Resolve<IServiceProvider>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            
            // exception handlers
            app.UseStatusCodePagesWithReExecute("/error/{0}");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
                app.UseExceptionHandler("/error");

            // Token Generation
            byte[] key = Encoding.UTF8.GetBytes("401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1");

            JwtBearerOptions options = new JwtBearerOptions()
            {
                AuthenticationScheme = JwtBearerDefaults.AuthenticationScheme,
                TokenValidationParameters = {
                   ValidIssuer = "ExampleIssuer",
                   ValidAudience = "ExampleAudience",
                   IssuerSigningKey = new SymmetricSecurityKey(key),
                   ValidateIssuerSigningKey = true,
                   ValidateLifetime = true,
                   ClockSkew = TimeSpan.Zero
                }
            };

            app.UseJwtBearerAuthentication(options); 

            app.UseFileServer();
            app.UseMvc();
        }
    }
}
