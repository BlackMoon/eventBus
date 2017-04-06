namespace domain.Dto
{
    /// <summary>
    /// AdkUserDto[AdkGroup, AdkUser] (выводится в дереве)
    /// </summary>
    public class AdkUserDto : AdkGroup.AdkGroup
    {        
        public bool Active { get; set; }
        
        public string Role { get; set; }
    }
}
