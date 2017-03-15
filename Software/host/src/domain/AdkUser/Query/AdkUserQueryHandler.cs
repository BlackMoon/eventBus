using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.AdkUser.Query
{
    public class AdkUserQueryHandler : IQueryHandler<FindUserByIdQuery, AdkUser>
    {
        private readonly IDbManager _dbManager;
        public AdkUserQueryHandler(IDbManager dbManager)
        {
            _dbManager = dbManager;
            _dbManager.Open();
        }

        public AdkUser Execute(FindUserByIdQuery query)
        {
            return _dbManager.DbConnection.QuerySingle<AdkUser>("SELECT * FROM adk_user.users u WHERE u.id = @id", new { id  = query.Id });
        }
    }
}
