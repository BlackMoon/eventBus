using System.Threading.Tasks;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using Dapper.Contrib.Extensions;

namespace domain.AdkUser.Query
{
    public class AdkUserQueryHandler : IQueryHandler<FindUserByIdQuery, AdkUser>, IQueryHandler<FindUserByLoginQuery, AdkUser>
    {
        private const string Select = "SELECT * FROM adk_user.users u";

        private readonly IDbManager _dbManager;
        public AdkUserQueryHandler(IDbManager dbManager)
        {
            _dbManager = dbManager;
        }

        public AdkUser Execute(FindUserByLoginQuery query)
        {
            _dbManager.Open(query.ConnectionString);
            return _dbManager.DbConnection.QuerySingle<AdkUser>($"{Select} WHERE u.login = @login", new { login = query.Login });
        }

        public AdkUser Execute(FindUserByIdQuery query)
        {
            _dbManager.Open();
            return _dbManager.DbConnection.Get<AdkUser>(query.Id);
        }

        public Task<AdkUser> ExecuteAsync(FindUserByLoginQuery query)
        {
            _dbManager.Open(query.ConnectionString);
            return _dbManager.DbConnection.QuerySingleAsync<AdkUser>($"{Select} WHERE u.login = @login", new { login = query.Login });
        }

        public Task<AdkUser> ExecuteAsync(FindUserByIdQuery query)
        {
            _dbManager.Open();
            return _dbManager.DbConnection.GetAsync<AdkUser>(query.Id);
        }
    }
}
