// Copyright (c) Nate Barbettini. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Host.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Kit.Core.Encryption;

namespace Host.Security.TokenProvider
{ 
    /// <summary>
    /// Token generator middleware component which is added to an HTTP pipeline.
    /// This class is not created by application code directly,
    /// instead it is added by calling the <see cref="TokenProviderAppBuilderExtensions.UseSimpleTokenProvider(Microsoft.AspNetCore.Builder.IApplicationBuilder, TokenProviderOptions)"/>
    /// extension method.
    /// </summary>
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly SecretStorage _storage;
        private readonly TokenProviderOptions _options;
        private readonly ILogger _logger;
        private readonly JsonSerializerSettings _serializerSettings;

        public TokenProviderMiddleware(
            RequestDelegate next,
            SecretStorage storage,
            IOptions<TokenProviderOptions> options,            
            ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<TokenProviderMiddleware>();
            _storage = storage;

            _options = options.Value;
            ThrowIfInvalidOptions(_options);

            _serializerSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
        }

        public Task Invoke(HttpContext context)
        {
            // If the request encryptionPath match, generate cipher
            if (_options.Encrypt)
            {
                if (context.Request.Path.Equals(_options.Encryption.Path, StringComparison.Ordinal))
                    return GenerateSecretKey(context);
            }

            // If the request tokenPath match, generate token
            if (context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
                return GenerateToken(context);

            return _next(context);
        }

        private async Task GenerateSecretKey(HttpContext context)
        {
            // Request must be POST with Content-Type: application/x-www-form-urlencoded
            if (!context.Request.Method.Equals("POST") || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Bad request.");
                return;
            }

            _logger.LogInformation("Handling request: " + context.Request.Path);

            string username = context.Request.Form["username"];
            if (string.IsNullOrWhiteSpace(username))
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid username.");
                return;
            }

            byte[] secretKey = new byte[_options.Encryption.KeySize / 4];
            RandomNumberGenerator.Create().GetBytes(secretKey);

            SecretItem si = new SecretItem()
            {
                Algorithm = _options.Encryption.Algorithm,
                Key = secretKey
            };

            // Serialize and return the secret item
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(si, _serializerSettings));
            // Store authenticated item
            _storage.Set(username, si);
        }

        private async Task GenerateToken(HttpContext context)
        {
            // Request must be POST with Content-Type: application/x-www-form-urlencoded
            if (!context.Request.Method.Equals("POST") || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Bad request.");
                return;
            }

            _logger.LogInformation("Handling request: " + context.Request.Path);

            // Проверка секрета
            string username = context.Request.Form["username"];
            // ReSharper disable once ConditionIsAlwaysTrueOrFalse
            if (username == null)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid username.");
                return;
            }

            string key = context.Request.Form["key"];
            byte[] keyBytes = string.IsNullOrEmpty(key) ? new byte[] { } : Convert.FromBase64String(key.Replace(' ', '+'));

            SecretItem si = _storage.Get(username);
            if (si == null || !keyBytes.SequenceEqual(si.Key))
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid secret key.");
                return;
            }

            // Аутентификация
            string password = context.Request.Form["password"];

            #region decryption
            if (_options.Encrypt)
            {
                using (SymmetricAlgorithm sa = AlgorithmFactory.GetSymmetricAlgorithm(_options.Encryption.Algorithm))
                {
                    byte[] pswdBytes = Convert.FromBase64String(password.Replace(' ', '+'));

                    sa.Key = si.Key;
                    sa.IV = pswdBytes.Take(16).ToArray();
                }


                using (Aes aes = Aes.Create())
                {
                    byte[] pswdBytes = Convert.FromBase64String(password.Replace(' ', '+'));

                    aes.Key = si.Key;
                    aes.IV = pswdBytes.Take(16).ToArray();



                    //ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                    //byte[] plainBytes = decryptor.TransformFinalBlock(secretBytes, 16, secretBytes.Length - 16);


                    using (MemoryStream msDecrypt = new MemoryStream(pswdBytes))
                    {
                        ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                        byte[] plainBytes = decryptor.TransformFinalBlock(pswdBytes, 16, keyBytes.Length - 16);

                        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                            {
                                password = srDecrypt.ReadToEnd();
                            }
                        }
                    }
                }
            }
            #endregion 

            ClaimsIdentity identity = await _options.IdentityResolver(username, password);
            if (identity == null)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid username or password.");
                return;
            }

            DateTime now = DateTime.UtcNow;

            // Specifically add the jti (nonce), iat (issued timestamp), and sub (subject/user) claims.
            // You can add other claims here, if you want:
            identity.AddClaims(new []{
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, await _options.NonceGenerator()),
                new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(now).ToString(), ClaimValueTypes.Integer64)
            });

            // Create the JWT and write it to a string
            JwtSecurityToken jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: identity.Claims,
                notBefore: now,
                expires: now.Add(_options.Expiration),
                signingCredentials: _options.SigningCredentials);

            string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                expires_in = (int)_options.Expiration.TotalSeconds
            };

            // Serialize and return the response
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response, _serializerSettings));

            // Store authenticated user's password
            _storage.Set(username, new SecretItem() { Password = password });
        }

        private static void ThrowIfInvalidOptions(TokenProviderOptions options)
        {
            if (string.IsNullOrEmpty(options.Path))
                throw new ArgumentNullException(nameof(TokenProviderOptions.Path));

            if (string.IsNullOrEmpty(options.Issuer))
                throw new ArgumentNullException(nameof(TokenProviderOptions.Issuer));

            if (string.IsNullOrEmpty(options.Audience))
                throw new ArgumentNullException(nameof(TokenProviderOptions.Audience));

            if (options.Expiration == TimeSpan.Zero)
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(TokenProviderOptions.Expiration));

            if (options.IdentityResolver == null)
                throw new ArgumentNullException(nameof(TokenProviderOptions.IdentityResolver));

            if (options.SigningCredentials == null)
                throw new ArgumentNullException(nameof(TokenProviderOptions.SigningCredentials));

            if (options.NonceGenerator == null)
                throw new ArgumentNullException(nameof(TokenProviderOptions.NonceGenerator));

            // CryptoOptions
            if (options.Encrypt)
            {
                if (string.IsNullOrEmpty(options.Encryption.Path))
                    throw new ArgumentNullException(nameof(CryptoOptions.Path));

                if (options.Encryption.KeySize == 0)
                    throw new ArgumentException("Must be a greater than zero KeySize.", nameof(CryptoOptions.KeySize));
            }
        }

        /// <summary>
        /// Get this datetime as a Unix epoch timestamp (seconds since Jan 1, 1970, midnight UTC).
        /// </summary>
        /// <param name="date">The date to convert.</param>
        /// <returns>Seconds since Unix epoch.</returns>
        public static long ToUnixEpochDate(DateTime date) => new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds();           
       
    }
}