using System;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Host.Security.SecretProvider
{
    /// <summary>
    /// Secret generator middleware component which is added to an HTTP pipeline.
    /// This class is not created by application code directly,
    /// instead it is added by calling the <see cref="SecretProviderAppBuilderExtensions.UseSimpleSecretProvider"/>
    /// extension method.
    /// </summary>
    public class SecretProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly SecretProviderOptions _options;
        private readonly SecretStorage _storage;
        private readonly ILogger _logger;
        private readonly JsonSerializerSettings _serializerSettings;

        public SecretProviderMiddleware(
            RequestDelegate next,
            SecretStorage storage,
            IOptions<SecretProviderOptions> options, 
            ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<SecretProviderMiddleware>();
            _storage = storage;

            _options = options.Value;
            ThrowIfInvalidOptions(_options);

            _serializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                Formatting = Formatting.Indented
            };
        }

        public Task Invoke(HttpContext context)
        {
            // If the request path doesn't match, skip
            if (!context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
                return _next(context);

            // Request must be POST with Content-Type: application/x-www-form-urlencoded
            if (!context.Request.Method.Equals("POST") || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;
                return context.Response.WriteAsync("Bad request.");
            }

            _logger.LogInformation("Handling request: " + context.Request.Path);

            return GenerateSecret(context);
        }

        private async Task GenerateSecret(HttpContext context)
        {
            string username = context.Request.Form["username"];

            if (string.IsNullOrWhiteSpace(username))
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid username.");
                return;
            }

            byte[] data = new byte[_options.KeySize / 4];
            RandomNumberGenerator.Create().GetBytes(data);

            SecretItem secret = new SecretItem()
            {
                Secret = data
            };

            // Serialize and return the secret
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(secret, _serializerSettings));
            // Store authenticated user
            _storage.Set(username, new SecretItem() { Secret = data });
        }

        private static void ThrowIfInvalidOptions(SecretProviderOptions options)
        {
            if (string.IsNullOrEmpty(options.Path))
                throw new ArgumentNullException(nameof(SecretProviderOptions.Path));

            if (options.KeySize < 16)
                throw new ArgumentNullException(nameof(SecretProviderOptions.KeySize), 
                    $"The algorithm requires SecurityKey.KeySize to be greater or equals than 16 bits. KeySize reported: {options.KeySize}.");
        }
    }
}
