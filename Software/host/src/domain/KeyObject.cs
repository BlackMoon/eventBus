using System.ComponentModel.DataAnnotations;

namespace domain
{
    public abstract class KeyObject
    {              
        [Key]
        public string Id { get; set; }

        public override int GetHashCode()
        {
            // ReSharper disable once NonReadonlyMemberInGetHashCode
            return Id.GetHashCode();
        }
    }
}
