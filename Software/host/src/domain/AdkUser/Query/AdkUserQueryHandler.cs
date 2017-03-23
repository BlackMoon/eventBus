using System.Linq;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System;

namespace domain.AdkUser.Query
{
    public class AdkUserQueryHandler : KeyObjectQueryHandler<FindUserByIdQuery, AdkUser>,         
        IFindRootGroupHandler<FindUserRootGroupQuery, AdkGroupUsers>,
        IQueryHandler<FindUserByLoginQuery, AdkUser>
    {
        private const string SelectGroup = "SELECT g.id, g.name, g.description, (select count(1) FROM adk_group_objects.group_objects o where o.group_id = g.id) AS cnt FROM adk_group_objects.groups g";
        private const string SelectUser = "SELECT * FROM adk_user.users u";

        public AdkUserQueryHandler(IDbManager dbManager) : base(dbManager)
        {
            
        }

        public AdkUser Execute(FindUserByLoginQuery query)
        {
            DbManager.Open(query.ConnectionString);
            return DbManager.DbConnection.QuerySingle<AdkUser>($"{SelectUser} WHERE u.login = @login", new { login = query.Login });
        }
        
        public Task<AdkUser> ExecuteAsync(FindUserByLoginQuery query)
        {
            DbManager.Open(query.ConnectionString);
            return DbManager.DbConnection.QuerySingleAsync<AdkUser>($"{SelectUser} WHERE u.login = @login", new { login = query.Login });
        }

        public AdkGroupUsers Execute(FindUserRootGroupQuery query)
        {
            DbManager.Open();

            var groups = DbManager.DbConnection.Query<AdkGroupUsers, long, AdkGroupUsers>($"{SelectGroup} where g.id = {query.RootGroupFunction}",
                (g, i) =>
                {
                    if (i > 0)
                        g.Objects = Enumerable.Empty<AdkUser>();
                    return g;
                }, splitOn: "*");

            return groups.FirstOrDefault();
        }

        public async Task<AdkGroupUsers> ExecuteAsync(FindUserRootGroupQuery query)
        {
            DbManager.Open();

            var groups = await DbManager.DbConnection.QueryAsync<AdkGroupUsers, long, AdkGroupUsers>($"{SelectGroup} where g.id = {query.RootGroupFunction}", 
                (g, i) =>
                {
                    if (i > 0)
                        g.Objects = Enumerable.Empty<AdkUser>();
                    return g;
                }, splitOn: "*");

            return groups.FirstOrDefault();
        }
    }
}
