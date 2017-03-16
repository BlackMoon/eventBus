using System.Threading.Tasks;
using Dapper;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;

namespace domain.Login.Command
{
    public class LoginCommandHandler : ICommandHandler<LoginCommand>
    {
        private readonly IDbManager _dbManager;
        public LoginCommandHandler(IDbManager dbManager)
        {
            _dbManager = dbManager;
        }

        /// <summary>
        /// Возвращает роль пользователя
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public void Execute(LoginCommand command)
        {
            _dbManager.Open($"Host={command.Host};Port={command.Port};Database={command.DataBase};User Id={command.UserName};Password={command.Password};Pooling=true;");
            _dbManager.Dispose();
        }

        public Task ExecuteAsync(LoginCommand command)
        {
            throw new System.NotImplementedException();
        }
    }
}
