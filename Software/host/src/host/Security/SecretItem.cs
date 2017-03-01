using Kit.Core.Web.Mvc.Converters;
using Newtonsoft.Json;

namespace Host.Security
{
    /// <summary>
    /// Единица безопасности
    /// </summary>
    public class SecretItem
    {
        public string Algorithm { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
       
        public byte[] Key { get; set; }
    }
}
