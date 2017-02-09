using System;
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
using Kit.Core.Web.Middleware.DebugMode;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Host
{
    public class Startup : DryIocStartup
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

            // check development (debug) mode
            app.CheckDebugMode();

            // exception handlers
            app.UseStatusCodePagesWithReExecute("/error/{0}");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
                app.UseExceptionHandler("/error");
            
            app.UseFileServer();
            app.UseMvc();
        }
    }
}
