using Newtonsoft.Json;

namespace Host.Security.SecretProvider
{
    /// <summary>
    /// Единица безопасности
    /// </summary>
    public class SecretItem
    {
        public string Algorithm { get; set; } = "AES";

        [JsonIgnore]
        public string Password { get; set; }

        public byte[] Secret { get; set; }
    }
}
