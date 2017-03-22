using Kit.Core.CQRS.Query;

namespace domain.KeyObject.Query
{
    /// <summary>
    /// Запрос. Найти объект по ключу
    /// </summary>
    public abstract class FindObjectByIdQuery : IQuery
    {
        public string Id { get; set; }
    }
}
