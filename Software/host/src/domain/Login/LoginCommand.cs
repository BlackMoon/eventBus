using System.ComponentModel.DataAnnotations;
using Kit.Core;
using Kit.Core.CQRS.Command;

namespace domain.Login
{
    public class LoginCommand : ICommand
    {
        public int Port { get; set; }

        public string DataBase { get; set; }

        public string Host { get; set; }

        public string UserName { get; set; }

        [EncryptDataType(DataType.Password)]
        public string Password { get; set; }
    }
}
