using System;
using Kit.Core.CQRS.Command;

namespace domain.Login
{
    public class LoginCommandHandler : ICommandHandler<LoginCommand>
    {
        public void Execute(LoginCommand command)
        {
            
        }
    }
}
