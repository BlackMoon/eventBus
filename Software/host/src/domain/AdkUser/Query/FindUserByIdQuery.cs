using Kit.Core.CQRS.Query;

namespace domain.AdkUser.Query
{
    /// <summary>
    /// Запрос. Найти пользователя по id
    /// </summary>
    public class FindUserByIdQuery : IQuery
    {
        public string Id { get; set; }
    }
}
