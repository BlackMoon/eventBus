using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using domain.Login;
using Host.TokenProvider;
using Kit.Core.Extensions;
using Kit.Core.CQRS.Command;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Host
{
    public partial class Startup
    {
        private void ConfigureAuth(IApplicationBuilder app)
        {
            IOptions<TokenProviderOptions> options = app.ApplicationServices.GetRequiredService<IOptions<TokenProviderOptions>>();
            TokenProviderOptions tokenOptions = options.Value;

            SymmetricSecurityKey signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenOptions.SecretKey));

            tokenOptions.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature);
            tokenOptions.IdentityResolver = (u, p) =>
            {
                ICommandDispatcher dispatcher = app.ApplicationServices.GetRequiredService<ICommandDispatcher>();
                dispatcher.Dispatch(new LoginCommand() { UserName = u, Password = p });

                ClaimsIdentity identity = new ClaimsIdentity(new GenericIdentity(u, "Token"), new Claim[] {});
                return Task.FromResult(identity);
            };
            
            app.UseSimpleTokenProvider(tokenOptions);
            
            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
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
