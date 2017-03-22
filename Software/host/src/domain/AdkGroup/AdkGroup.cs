using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace domain.AdkGroup
{
    [Table("adk_group_objects.groups")]
    public class AdkGroup : KeyObject.KeyObject
    {
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
