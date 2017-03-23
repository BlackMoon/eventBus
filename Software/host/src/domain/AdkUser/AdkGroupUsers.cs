using System.Linq;

namespace domain.AdkUser
{
    /// <summary>
    /// Группа adk_user.users
    /// </summary>
    public class AdkGroupUsers : AdkGroup.AdkGroup
    {
        public AdkGroupUsers()
        {
            Objects = Enumerable.Empty<AdkUser>();
        }
    }
}
