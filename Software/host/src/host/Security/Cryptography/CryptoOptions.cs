using Kit.Core.Encryption;

namespace Host.Security.Cryptography
{
    /// <summary>
    /// Crypto options
    /// </summary>
    public class CryptoOptions
    {
        /// <summary>
        /// Key size: in bits
        /// </summary>
        public byte KeySize { get; set; } = 128;

        /// <summary>
        /// Crypto algorithm
        /// </summary>
        public AlgorithmKind Algorithm { get; set; }

        /// <summary>
        /// The relative request path to listen on.
        /// </summary>
        /// <remarks>The default path is <c>/secret</c>.</remarks>
        public string Path { get; set; } = "/secret";
    }
}
