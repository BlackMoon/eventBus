using System.Collections.Generic;
using System.Threading.Tasks;
using domain;
using domain.AdkGroup;
using domain.AdkUser;
using domain.AdkUser.Query;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Host.Controllers
{
    [Route("api/[controller]")]
    public class AdkUserController : Controller
    {
        private readonly IQueryDispatcher _queryDispatcher;
        public AdkUserController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
        }

        // GET: api/values
        [HttpGet]
        public async Task<dynamic> Get()
        {
            AdkGroup g = await _queryDispatcher.DispatchAsync<FindUserRootGroupQuery, AdkGroup>(new FindUserRootGroupQuery());
            return new [] { g };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public Task<AdkUser> Get(string id)
        {
            return _queryDispatcher.DispatchAsync<FindUserByIdQuery, AdkUser>(new FindUserByIdQuery() {Id = id });
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
