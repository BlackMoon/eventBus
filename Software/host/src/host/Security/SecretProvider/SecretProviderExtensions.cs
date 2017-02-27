using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;

namespace Host.Security.SecretProvider
{
    /// <summary>
    /// Adds a secret generation endpoint to an application pipeline.
    /// </summary>
    public static class SecretProviderAppBuilderExtensions
    {
        /// <summary>
        /// Adds the <see cref="SecretProviderMiddleware"/> middleware to the specified <see cref="IApplicationBuilder"/>, which enables token generation capabilities.
        /// <param name="app">The <see cref="IApplicationBuilder"/> to add the middleware to.</param>
        /// <param name="options">A  <see cref="SecretProviderOptions"/> that specifies options for the middleware.</param>
        /// <returns>A reference to this instance after the operation has completed.</returns>
        /// </summary>
        public static IApplicationBuilder UseSimpleSecretProvider(this IApplicationBuilder app, SecretProviderOptions options)
        {
            if (app == null)
                throw new ArgumentNullException(nameof(app));

            if (options == null)
                throw new ArgumentNullException(nameof(options));

            return app.UseMiddleware<SecretProviderMiddleware>(Options.Create(options));
        }
    }
}
