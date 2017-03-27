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

        // GET: api/values
        [HttpGet]
        public async Task<dynamic> Get(string groupId)
        {
            IList<AdkUserDto> objects;
            if (groupId == null)                   // Корневой уровень дерева
            {
                AdkUserDto g = await _queryDispatcher.DispatchAsync<FindUserRootGroupQuery, AdkUserDto>(new FindUserRootGroupQuery());
                objects = new[] { g };
            }
            else
            {
                var result = await _queryDispatcher.DispatchAsync<FindGroupUsersChildrenQuery, IEnumerable<AdkUserDto>>(new FindGroupUsersChildrenQuery() { GroupId = groupId });
                objects = result?.ToList();
            }

            return new { data = objects, total = objects.Count() };
        }
    }
}
