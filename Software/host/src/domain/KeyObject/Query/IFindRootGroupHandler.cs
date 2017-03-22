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

    interface IFindRootGroupHandler<TQuery> : IQueryHandler<TQuery, AdkGroup.AdkGroup> where TQuery : IFindRootGroupQuery
    {
    }
}
