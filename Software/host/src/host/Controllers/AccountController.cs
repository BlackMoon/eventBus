using System.Collections.Generic;
using domain.Login;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Host.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get(LoginCommand command)
        {
            return new string[] { "value1", "value2" };
        }
    }
}
