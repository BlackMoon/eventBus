using Kit.Core.CQRS.Query;

namespace domain.KeyObject.Query
{
    /// <summary>
    /// Найти корневую группу
    /// </summary>
    interface IFindRootGroupQuery : IQuery
    {
        string RootGroupFunction { get; }
    }

    /// <summary>
    /// Query Hadler корневой группы
    /// </summary>
    /// <typeparam name="TQuery"></typeparam>
    /// <typeparam name="TParam">тип объекта в группе</typeparam>
    interface IFindRootGroupHandler<in TQuery, TParam> : IQueryHandler<TQuery, TParam> where TQuery : IFindRootGroupQuery where TParam : AdkGroup.AdkGroup
    {
    }
}
