namespace Host.Security.SecretProvider
{
    /// <summary>
    /// Provides options for <see cref="SecretProviderMiddleware"/>.
    /// </summary>
    public class SecretProviderOptions
    {
        /// <summary>
        /// RandomData's byte array length (int bits)
        /// </summary>
        public byte KeySize { get; set; } = 32;

        /// <summary>
        /// The relative request path to listen on.
        /// </summary>
        /// <remarks>The default path is <c>/secret</c>.</remarks>
        public string Path { get; set; } = "/secret";
    }
}
