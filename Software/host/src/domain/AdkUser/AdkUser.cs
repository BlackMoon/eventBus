using System.ComponentModel.DataAnnotations.Schema;

namespace domain.AdkUser
{
    [Table("adk_user.users")]
    public class AdkUser : KeyObject.KeyObject
    {
        public string Login { get; set; }
        
        public string Description { get; set; }
    
        public bool Active { get; set; }
    
        public bool IsAdmin { get; set; }
    }
}
