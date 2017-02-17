using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using domain.Login;
using Host.TokenProvider;
using Kit.Core.CQRS.Command;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Kit.Core.Identity;
using Kit.Dal.Configuration;

namespace Host
{
    public partial class Startup
    {
        private const byte xor = 128;

        private void ConfigureAuth(IApplicationBuilder app)
        {   
            TokenProviderOptions tokenOptions = app.ApplicationServices.GetRequiredService<IOptions<TokenProviderOptions>>().Value;

            SymmetricSecurityKey signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(tokenOptions.SecretKey));

            tokenOptions.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256Signature);
            tokenOptions.IdentityResolver = (u, p) =>
            {
                ConnectionOptions connOptions = app.ApplicationServices.GetRequiredService<IOptions<ConnectionOptions>>().Value;
                ICommandDispatcher dispatcher = app.ApplicationServices.GetRequiredService<ICommandDispatcher>();

                ClaimsIdentity identity = null;
                try
                {
                    dispatcher.Dispatch(
                        new LoginCommand()
                        {
                            Host = connOptions.Server,
                            Port = connOptions.Port,
                            DataBase = connOptions.DataSource,
                            UserName = u,
                            Password = p
                        });

                    // password encryption with XOR (value ^ 128) operator
                    char[] buff = p.ToCharArray();
                    for (int i = 0; i < p.Length; ++i)
                    {
                        buff[i] = (char)(p[i] ^ xor);
                    }

                    Claim[] claims = { new Claim(ConnectionClaimTypes.Password, new string(buff)) };

                    identity = new ClaimsIdentity(new GenericIdentity(u, "Token"), claims);
                }
                catch
                {
                    // ignored
                }

                return Task.FromResult(identity);
            };
            
            app.UseSimpleTokenProvider(tokenOptions);
            
            app.UseJwtBearerAuthentication(new JwtBearerOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                Events = new JwtBearerEvents() {                    
                    OnChallenge = ctx =>
                    {
                        // prevent 404 status code instead of 401
                        return Task.FromResult(0);
                    }, 
                    OnTokenValidated = ctx =>
                    {
                        ClaimsPrincipal cp = ctx.Ticket.Principal;

                        ClaimsIdentity ci = cp.Identity as ClaimsIdentity;
                        if (ci != null)
                        {
                            Claim claim = ci.FindFirst(ConnectionClaimTypes.Password);
                            string psw = claim.Value;

                            // password decryption with XOR (value ^ 128) operator
                            char[] buff = psw.ToCharArray();
                            for (int i = 0; i < psw.Length; ++i)
                            {
                                buff[i] = (char)(psw[i] ^ xor);
                            }

                            ci.TryRemoveClaim(claim);
                            ci.AddClaim(new Claim(ConnectionClaimTypes.Password, new string(buff)));

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
