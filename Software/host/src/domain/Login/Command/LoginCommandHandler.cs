using Dapper;
using Kit.Core.CQRS.Command;
using Kit.Dal.DbManager;

namespace domain.Login.Command
{
    public class LoginCommandHandler : ICommandHandlerWithResult<LoginCommand, LoginCommandResult>
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
        public LoginCommandResult Execute(LoginCommand command)
        {
            bool isAdmin;
            try
            {
                _dbManager.Open($"Host={command.Host};Port={command.Port};Database={command.DataBase};User Id={command.UserName};Password={command.Password};Pooling=true;");
                isAdmin = _dbManager.DbConnection.QuerySingle<bool>("SELECT u.is_admin FROM adk_user.users u WHERE u.login = @login", new { login = command.UserName });
            }
            finally
            {
                _dbManager.Dispose();
            }

            return new LoginCommandResult(){ IsAdmin = isAdmin };
        }
    }
}
