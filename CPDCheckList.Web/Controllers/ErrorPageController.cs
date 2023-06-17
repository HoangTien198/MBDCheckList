using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Controllers
{
    public class ErrorPageController : Controller
    {
        // GET: ErrorPage
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Error404()
        {
            return View();
        }
    }
}