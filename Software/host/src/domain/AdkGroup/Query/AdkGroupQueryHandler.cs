using domain.Common.Query;
using Kit.Dal.DbManager;

namespace domain.AdkGroup.Query
{
    public class AdkGroupQueryHandler : KeyObjectQueryHandler<FindGroupByIdQuery, AdkGroup>
    {
        public AdkGroupQueryHandler(IDbManager dbManager) : base(dbManager)
        {
        }
    }
}
