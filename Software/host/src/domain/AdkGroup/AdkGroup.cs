using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using domain.Common;

namespace domain.AdkGroup
{
    [Table("adk_group_objects.groups")]
    public class AdkGroup : KeyObject, IComponent
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<IComponent> Objects { get; set; }
    }    
}
