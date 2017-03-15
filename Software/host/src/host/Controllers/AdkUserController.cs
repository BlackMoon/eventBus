﻿using System.Collections.Generic;
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
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public AdkUser Get(string id)
        {
            return _queryDispatcher.Dispatch<FindUserByIdQuery, AdkUser>(new FindUserByIdQuery() {Id = id });
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