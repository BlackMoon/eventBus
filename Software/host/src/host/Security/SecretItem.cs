using Host.Security.Cryptography;
using Newtonsoft.Json;

namespace Host.Security
{
    /// <summary>
    /// Единица безопасности
    /// </summary>
    public class SecretItem
    {
        public AlgorithmKind Algorithm { get; set; }

        [JsonIgnore]
        public string Password { get; set; }       
      
        public byte[] Key { get; set; }
    }
}
