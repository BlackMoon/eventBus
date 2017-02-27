using System;
using CacheManager.Core;
using Kit.Core.Storage;

namespace Host.Security
{
    public class PasswordStorage : IStorage<string, string>
    {
        private const string Region = "Password";

        private readonly ICacheManager<object> _cacheManager;

        public PasswordStorage(ICacheManager<object> cacheManager)
        {
            _cacheManager = cacheManager;
        }

        public string Get(string key) => _cacheManager.Get<string>(key, Region);

        public void Set(string key, string item) => _cacheManager.Put(key, item, Region);
        public void Set(string key, string item, Func<string, string> updateValue)
        {
            throw new NotImplementedException();
        }
    }
}
