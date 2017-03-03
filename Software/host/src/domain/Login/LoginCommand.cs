using System.ComponentModel.DataAnnotations;
using Kit.Core.CQRS.Command;
using Kit.Core.Encryption;

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
