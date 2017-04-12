using System;
using domain.AdkUser.Query;
using domain.Dto;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Host.Controllers
{
    /// <summary>
    /// Контроллер вывода дерева пользователей (AdkUser)
    /// </summary>
    [Route("api/[controller]")]
    public class AdkUserDtoController : Controller
    {
        private readonly IQueryDispatcher _queryDispatcher;
        public AdkUserDtoController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        /// <summary>
        /// Рекурсивно получить объекты группы
        /// </summary>
        /// <param name="groupId">ID группы</param>
        /// <param name="initialExpandDepth">Начальный уровень открытия, если initialExpandDepth = -1, открываются все узлы</param>
        /// <returns></returns>
        private async Task<IEnumerable<AdkUserDto>> GetGroupObjects(string groupId, int initialExpandDepth)
        {
            var result = await _queryDispatcher.DispatchAsync<FindGroupUsersChildrenQuery, IEnumerable<AdkUserDto>>(new FindGroupUsersChildrenQuery() { GroupId = groupId });
            IList<AdkUserDto> objects = result.ToList();

            if (initialExpandDepth == -1 || initialExpandDepth > 0)
            {   
                foreach (AdkUserDto aud in objects)
                {
                    if (aud.Objects != null)
                        aud.Objects = await GetGroupObjects(aud.Id, Math.Max(--initialExpandDepth, -1));
                }
            }

            return objects;
        }

        /// <summary>
        /// Get-запрос получения дерева AdkUserDto
        /// </summary>
        /// <param name="groupId">ID группы</param>
        /// <param name="initialExpandDepth">Начальный уровень открытия, если initialExpandDepth = -1, открываются все узлы</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<dynamic> Get(string groupId, int initialExpandDepth)
        {
            IList<AdkUserDto> objects;
            if (groupId == null)                   // Корневой уровень дерева
            {
                AdkUserDto g = await _queryDispatcher.DispatchAsync<FindUserRootGroupQuery, AdkUserDto>(new FindUserRootGroupQuery());
                if (initialExpandDepth == -1 || initialExpandDepth > 0)
                    g.Objects = await GetGroupObjects(g.Id, Math.Max(--initialExpandDepth, -1));

                objects = new[] { g };
            }
            else
            {
                var result = await GetGroupObjects(groupId, 0);
                objects = result.ToList();
            }

            return new { data = objects, total = objects.Count() };
        }
    }
}
