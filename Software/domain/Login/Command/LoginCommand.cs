using Kit.Core.CQRS.Command;

namespace domain.Login.Command
{
    public class LoginCommand : ICommand
    {
        public int Port { get; set; }

        public string DataBase { get; set; }

        public string Host { get; set; }

        public string UserName { get; set; }
        
        public string Password { get; set; }
    }
}
