﻿using System.Collections.Generic;
using System.Data;
using Kit.Dal.DbManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private readonly IDbManager _dbManager;

        public ValuesController(IDbManager dbManager)
        {
            _dbManager = dbManager;           
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            IDataReader r = _dbManager.ExecuteReader(CommandType.Text, "select a.id from adk_user.users a");
            while (r.Read())
            {
                var id = r.GetString(0);
            }
            _dbManager.CloseReader();            
            
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
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
