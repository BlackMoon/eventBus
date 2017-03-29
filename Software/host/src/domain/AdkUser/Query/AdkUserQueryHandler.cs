using System.Collections.Generic;
using System.Threading.Tasks;
using domain.Common.Query;
using Dapper;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;
using System;
using domain.Dto;
using Mapster;
using Dapper.Contrib.Extensions;

namespace domain.AdkUser.Query
{
    public class AdkUserQueryHandler : KeyObjectQueryHandler<FindUserByIdQuery, AdkUser>,         
        IFindRootGroupHandler<FindUserRootGroupQuery, AdkUserDto>,
        IQueryHandler<FindGroupUsersChildrenQuery, IEnumerable<AdkUserDto>>,
        IQueryHandler<FindUserByLoginQuery, AdkUser>,
        IQueryHandler<GetAllQuery, IEnumerable<AdkUser>>
    {
        private const string SelectGroup = "SELECT g.id, g.name, g.description FROM adk_group_objects.groups g";
        private const string SelectUser = "SELECT * FROM adk_user.users u";

        public AdkUserQueryHandler(IDbManager dbManager) : base(dbManager)
        {
            
        }

        public AdkUser Execute(FindUserByLoginQuery query)
        {
            DbManager.Open(query.ConnectionString);
            return DbManager.DbConnection.QuerySingleOrDefault<AdkUser>($"{SelectUser} WHERE u.login = @login", new { login = query.Login });
        }
        
        public Task<AdkUser> ExecuteAsync(FindUserByLoginQuery query)
        {
            DbManager.Open(query.ConnectionString);
            return DbManager.DbConnection.QuerySingleOrDefaultAsync<AdkUser>($"{SelectUser} WHERE u.login = @login", new { login = query.Login });
        }

        public AdkUserDto Execute(FindUserRootGroupQuery query)
        {
            DbManager.Open();

            AdkUserDto dto = new AdkUserDto();
            AdkGroup.AdkGroup group = DbManager.DbConnection.QuerySingleOrDefault<AdkGroup.AdkGroup>($"{SelectGroup} where g.id = {query.RootGroupFunction}");
            return group.Adapt(dto);

        }

        public async Task<AdkUserDto> ExecuteAsync(FindUserRootGroupQuery query)
        {
            DbManager.Open();

            AdkUserDto dto = new AdkUserDto();
            AdkGroup.AdkGroup group = await DbManager.DbConnection.QuerySingleOrDefaultAsync<AdkGroup.AdkGroup>($"{SelectGroup} where g.id = {query.RootGroupFunction}");
            return group.Adapt(dto);
        }

        public IEnumerable<AdkUserDto> Execute(FindGroupUsersChildrenQuery query)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<AdkUserDto>> ExecuteAsync(FindGroupUsersChildrenQuery query)
        {
            DbManager.Open();

            return DbManager.DbConnection.QueryAsync<AdkGroup.AdkGroup, AdkUser, AdkUserDto>(
                @"SELECT g.*, u.* 
                    FROM adk_group_objects.group_objects o 
                    LEFT OUTER JOIN adk_group_objects.groups g ON g.id = o.object_id 
                    LEFT OUTER JOIN adk_user.users u ON u.id = o.object_id
                WHERE o.group_id = @groupId",
                (g, u) =>
                {
                    AdkUserDto dto = new AdkUserDto();

                    if (g.Id != null)
                        return g.Adapt(dto);
                    
                    return u.Adapt(dto);
                },
                new { groupId = query.GroupId });
        }

        public IEnumerable<AdkUser> Execute(GetAllQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.GetAll<AdkUser>();
        }

        public Task<IEnumerable<AdkUser>> ExecuteAsync(GetAllQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.GetAllAsync<AdkUser>();
        }
    }
}
