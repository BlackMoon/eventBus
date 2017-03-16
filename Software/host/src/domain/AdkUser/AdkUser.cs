namespace domain.AdkUser
{
    public class AdkUser : KeyObject
    {
        public string Login { get; set; }
        
        public string Description { get; set; }
    
        public bool Active { get; set; }
    
        public bool IsAdmin { get; set; }
    }
}
