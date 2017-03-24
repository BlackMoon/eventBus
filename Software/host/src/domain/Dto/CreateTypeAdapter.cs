using System;
using System.Linq;
using System.Threading.Tasks;
using Kit.Core.CQRS.Job;
using Mapster;
using domain.Common;

namespace domain.Dto
{
    public class CreateTypeAdapter : IStartupJob
    {
        public void Run()
        {
            // AdkGroupUsers --> AdkUserDto
            TypeAdapterConfig<AdkGroup.AdkGroup, AdkUserDto>
                .ForType()
                .Map(dest => dest.Objects, src => Enumerable.Empty<IComponent>());

            // AdkUser --> AdkUserDto
            TypeAdapterConfig<AdkUser.AdkUser, AdkUserDto>
                .ForType()
                .Map(dest => dest.Name, src => src.Login)
                .Map(dest => dest.Role, src => src.IsAdmin ? "Администратор" : "Пользователь");
        }

        public Task RunAsync()
        {
            throw new NotImplementedException();
        }
    }
}
