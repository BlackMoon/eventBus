using System.ComponentModel.DataAnnotations.Schema;
using Kit.Core.CQRS.Query;

namespace domain.AdkUser
{
    [Table("adk_user.users")]
    public class AdkUser : KeyObject, IQueryResult
    {
        [Column("login")]
        public string Login { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("active")]
        public bool Active { get; set; }

        [Column("is_admin")]
        public bool IsAdmin { get; set; }
    }
}
