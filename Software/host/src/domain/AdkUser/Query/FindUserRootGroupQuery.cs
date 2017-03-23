using domain.Common.Query;

namespace domain.AdkUser.Query
{
    public class FindUserRootGroupQuery : IFindRootGroupQuery
    {
        public string RootGroupFunction { get; } = "adk_user.users_group_root_id()";
    }
}
