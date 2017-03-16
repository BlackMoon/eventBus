using System;
using System.Threading.Tasks;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.AdkUser.Query
{
    public class AdkUserQueryHandler : IQueryHandler<FindUserByIdQuery, AdkUser>, IQueryHandler<FindUserByLoginQuery, AdkUser>
    {
        private const string Sql = "SELECT * FROM adk_user.users u";

        private readonly IDbManager _dbManager;
        public AdkUserQueryHandler(IDbManager dbManager)
        {
            _dbManager = dbManager;
            _dbManager.Open();
        }

        public AdkUser Execute(FindUserByLoginQuery query)
        {
            return ExecuteAsync(query).Result;
        }

        public AdkUser Execute(FindUserByIdQuery query)
        {
            return ExecuteAsync(query).Result;
        }

        public Task<AdkUser> ExecuteAsync(FindUserByLoginQuery query)
        {
            return _dbManager.DbConnection.QuerySingleAsync<AdkUser>($"{Sql} WHERE u.id = @id", new { id = query.Login });
        }

        public Task<AdkUser> ExecuteAsync(FindUserByIdQuery query)
        {
            return _dbManager.DbConnection.QuerySingleAsync<AdkUser>($"{Sql} WHERE u.id = @id", new { id = query.Id });
        }
    }
}
