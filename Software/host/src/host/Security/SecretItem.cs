using Kit.Core.Encryption;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Host.Security
{
    /// <summary>
    /// Единица безопасности
    /// </summary>
    public class SecretItem
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public AlgorithmKind Algorithm { get; set; }

        [JsonIgnore]
        public string Password { get; set; }       
      
        public byte[] Key { get; set; }
    }
}
