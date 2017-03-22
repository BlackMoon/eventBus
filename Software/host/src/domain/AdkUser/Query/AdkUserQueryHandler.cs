using System.Threading.Tasks;
using domain.KeyObject.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.AdkUser.Query
{
    public class AdkUserQueryHandler : KeyObjectQueryHandler<FindUserByIdQuery, AdkUser>,         
        IFindRootGroupHandler<FindUserRootGroupQuery>,
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

        public AdkGroup.AdkGroup Execute(FindUserRootGroupQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.QuerySingle<AdkGroup.AdkGroup>($"{SelectGroup} WHERE g.id = {query.RootGroupFunction}");
        }

        public Task<AdkGroup.AdkGroup> ExecuteAsync(FindUserRootGroupQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.QuerySingleAsync<AdkGroup.AdkGroup>($"{SelectGroup} WHERE g.id = {query.RootGroupFunction}");
        }
    }
}
