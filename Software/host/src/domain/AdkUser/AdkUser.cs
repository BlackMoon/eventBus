using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;

namespace domain.AdkUser
{
    [Table("adk_user.users")]
    public class AdkUser : KeyObject, IComponent
    {
        public string Login { get; set; }
        
        public string Description { get; set; }
    
        public bool Active { get; set; }
    
        public bool IsAdmin { get; set; }
    }
}
