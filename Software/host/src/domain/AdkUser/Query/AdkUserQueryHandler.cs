using System;
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
        }

        public AdkUser Execute(FindUserByIdQuery query)
        {
            return _dbManager.DbConnection.QuerySingle<AdkUser>("WHERE id = @id", new { id = query.Id });
        }
    }
}
