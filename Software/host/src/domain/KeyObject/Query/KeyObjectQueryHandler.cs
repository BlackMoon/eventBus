using System.Threading.Tasks;
using Dapper.Contrib.Extensions;
using Kit.Core.CQRS.Query;
using Kit.Dal.DbManager;

namespace domain.KeyObject.Query
{
    public abstract class KeyObjectQueryHandler<TIdQuery, TResult> : IQueryHandler<TIdQuery, TResult>
        where TIdQuery : FindObjectByIdQuery
        where TResult : class
    {
        protected readonly IDbManager DbManager;

        protected KeyObjectQueryHandler(IDbManager dbManager)
        {
            DbManager = dbManager;
        }

        public virtual TResult Execute(TIdQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.Get<TResult>(query.Id);
        }

        public virtual Task<TResult> ExecuteAsync(TIdQuery query)
        {
            DbManager.Open();
            return DbManager.DbConnection.GetAsync<TResult>(query.Id);
        }
    }
}
