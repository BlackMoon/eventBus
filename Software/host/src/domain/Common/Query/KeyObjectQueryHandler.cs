using System.Threading.Tasks;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.Common.Query
{
    public abstract class KeyObjectQueryHandler<TQuery, TResult> : IQueryHandler<TQuery, TResult>
        where TQuery : FindObjectByIdQuery 
        where TResult : class
    {
        protected readonly IDbManager DbManager;

        protected KeyObjectQueryHandler(IDbManager dbManager)
        {
            DbManager = dbManager;
        }       

        public virtual TResult Execute(TQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.Get<TResult>(query.Id);
        }
       
        public virtual Task<TResult> ExecuteAsync(TQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.GetAsync<TResult>(query.Id);
        }
    }
}
