using Kit.Core.CQRS.Query;

namespace domain.AdkUser.Query
{
    /// <summary>
    /// Запрос. Найти пользователя по login
    /// </summary>
    public class FindUserByLoginQuery : IQuery
    {
        public string Login { get; set; }
    }
}
