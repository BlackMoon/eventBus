using System.IO;
using System.Reflection;
using System.Runtime.Loader;
using System.Threading.Tasks;
using Kit.Core.CQRS.Job;
using Kit.Dal.DbManager;

namespace Host.Job
{
    /// <summary>
    /// Задача - обновление списка адаптеров
    /// </summary>
    public class UpdateAdapterCache : IJob
    {
        private const string AdapterRoot = "adapter";

        private readonly IDbManager _dbManager;
        public UpdateAdapterCache(IDbManager dbManager)
        {
            _dbManager = dbManager;
        }

        public void Run()
        {
            // todo load from db


            // Register assemblies
            string adapterPath = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), AdapterRoot);
            Directory.CreateDirectory(adapterPath);

            foreach (string d in Directory.GetDirectories(adapterPath))
            {
                foreach (string f in Directory.GetFiles(d, "*.dll"))
                {
                    try
                    {
                        AssemblyLoadContext.Default.LoadFromAssemblyPath(f);
                    }
                    catch
                    {
                        // ignored
                    }
                }
            }
        }

        public Task RunAsync()
        {
            throw new System.NotImplementedException();
        }
    }
}
