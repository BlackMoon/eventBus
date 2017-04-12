using System.Threading.Tasks;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;

namespace domain.Login.Command
{
    public class LoginCommandHandler : ICommandHandlerWithResult<LoginCommand, string>
    {
        private readonly IDbManager _dbManager;
        public LoginCommandHandler(IDbManager dbManager)
        {
            _dbManager = dbManager;
        }

        /// <summary>
        /// Возвращает строку соединения
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        public string Execute(LoginCommand command)
        {
            string connectionString = $"Host={command.Host};Port={command.Port};Database={command.DataBase};User Id={command.UserName};Password={command.Password};Pooling=true;";

            _dbManager.Open(connectionString);
            _dbManager.Dispose();

            return connectionString;
        }

        public Task<string> ExecuteAsync(LoginCommand command)
        {
            throw new System.NotImplementedException();
        }
    }
}
