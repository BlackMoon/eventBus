﻿using System.Threading.Tasks;
using domain.AdkUser;
using domain.AdkUser.Query;
using Kit.Core.CQRS.Query;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers
{
    [Route("api/[controller]")]
    public class AdkUsersController : Controller
    {
        private readonly IQueryDispatcher _queryDispatcher;
        public AdkUsersController(IQueryDispatcher queryDispatcher)
        {
            _queryDispatcher = queryDispatcher;
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