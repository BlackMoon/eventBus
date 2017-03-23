﻿using System;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using domain.AdkUser;
using domain.AdkUser.Query;
using domain.Login.Command;
using Host.Security;
using Host.Security.TokenProvider;
using Kit.Core.CQRS.Command;
using Kit.Core.CQRS.Query;
using Kit.Core.Identity;
using Kit.Dal.Configuration;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Host
{
    public partial class Startup
    {
        private void ConfigureAuth(IApplicationBuilder app)
        {
            TokenProviderOptions tokenOptions = app.ApplicationServices.GetRequiredService<IOptions<TokenProviderOptions>>().Value;

            if (tokenOptions.TwoFactorAuth)
            {
                tokenOptions.TwoFactorAuthOptions.SecretKeyResolver = u =>
                {
                    byte[] key;
                    // todo валидация логина  
                    if (true)
                    {
                        key = new byte[tokenOptions.TwoFactorAuthOptions.KeySize/4];
                        RandomNumberGenerator.Create().GetBytes(key);
                    }
                    return Task.FromResult(key);
                };
            }

            SymmetricSecurityKey signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenOptions.SecretPhrase));

            tokenOptions.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature);
            tokenOptions.IdentityResolver = async (u, p) =>
            {
                ConnectionOptions connOptions = app.ApplicationServices.GetRequiredService<IOptions<ConnectionOptions>>().Value;
                ICommandDispatcher commandDispatcher = app.ApplicationServices.GetRequiredService<ICommandDispatcher>();
                IQueryDispatcher queryDispatcher = app.ApplicationServices.GetRequiredService<IQueryDispatcher>();
                ILogger<TokenProviderMiddleware> logger = app.ApplicationServices.GetRequiredService<ILogger<TokenProviderMiddleware>>();

                ClaimsIdentity identity = null;
                try
                {
                    string connectionString = commandDispatcher.Dispatch<LoginCommand, string>(
                        new LoginCommand
                        {
                            Host = connOptions.Server,
                            Port = connOptions.Port,
                            DataBase = connOptions.DataSource,
                            UserName = u,
                            Password = p
                        });
                    
                    AdkUser adkUser = await queryDispatcher.DispatchAsync<FindUserByLoginQuery, AdkUser>(new FindUserByLoginQuery { ConnectionString = connectionString, Login = u});

                    Claim[] claims = (adkUser != null) ? 
                        new[] { new Claim("description", adkUser.Description), new Claim("isadmin", adkUser.IsAdmin.ToString(), ClaimValueTypes.Boolean) } : 
                        null;

                    identity = new ClaimsIdentity(new GenericIdentity(u, "Token"), claims);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex.Message);    
                }

                return await Task.FromResult(identity);
            };

            app.UseSimpleTokenProvider(tokenOptions);
            
            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                Events = new JwtBearerEvents
                {
                    OnChallenge = ctx => Task.FromResult(0),            // prevent 404 status code instead of 401              
                    OnTokenValidated = ctx =>
                    {
                        SecretStorage storage = app.ApplicationServices.GetRequiredService<SecretStorage>();

                        ClaimsPrincipal cp = ctx.Ticket.Principal;

                        ClaimsIdentity ci = cp.Identity as ClaimsIdentity;
                        if (ci != null)
                        {
                            ci.AddClaim(new Claim(ConnectionClaimTypes.Password, storage.Get(ci.Name)?.Password));
                            ctx.Ticket = new AuthenticationTicket(cp, new AuthenticationProperties(), ctx.Options.AuthenticationScheme);
                        }

                        return Task.FromResult(0);
                    }
                },

                TokenValidationParameters = new TokenValidationParameters
                {
                    // The signing key must match!
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = signingKey,

                    // Validate the JWT Issuer (iss) claim
                    ValidateIssuer = true,
                    ValidIssuer = tokenOptions.Issuer,

                    // Validate the JWT Audience (aud) claim
                    ValidateAudience = true,
                    ValidAudience = tokenOptions.Audience,

                    // Validate the token expiry
                    ValidateLifetime = true,

                    // If you want to allow a certain amount of clock drift, set that here:
                    ClockSkew = TimeSpan.Zero
                }                
            });
        }
    }
}
