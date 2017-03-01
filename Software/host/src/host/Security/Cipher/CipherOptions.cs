namespace Host.Security.Cipher
{
    /// <summary>
    /// Cipher options
    /// </summary>
    public class CipherOptions
    {
        /// <summary>
        /// Key size: in bits
        /// </summary>
        public byte KeySize { get; set; } = 128;

        /// <summary>
        /// Cipher algorithm
        /// </summary>
        public string Algorithm { get; set; } = "AES";

        /// <summary>
        /// The relative request path to listen on.
        /// </summary>
        /// <remarks>The default path is <c>/secret</c>.</remarks>
        public string Path { get; set; } = "/secret";
    }
}
