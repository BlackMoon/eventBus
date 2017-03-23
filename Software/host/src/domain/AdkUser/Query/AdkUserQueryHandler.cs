using System.Threading.Tasks;
using domain.AdkGroup;
using domain.KeyObject.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.AdkUser.Query
{
    public class AdkUserQueryHandler : KeyObjectQueryHandler<FindUserByIdQuery, AdkUser>,         
        IFindRootGroupHandler<FindUserRootGroupQuery, AdkGroupUsers>,
        IQueryHandler<FindUserByLoginQuery, AdkUser>
    {
        private const string SelectGroup = "SELECT * FROM adk_group_objects.groups g";
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
            return DbManager.DbConnection.QuerySingle<AdkGroupUsers>($"{SelectGroup} WHERE g.id = {query.RootGroupFunction}");
        }

        public Task<AdkGroupUsers> ExecuteAsync(FindUserRootGroupQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.QuerySingleAsync<AdkGroupUsers>($"{SelectGroup} WHERE g.id = {query.RootGroupFunction}");
        }
    }
}
