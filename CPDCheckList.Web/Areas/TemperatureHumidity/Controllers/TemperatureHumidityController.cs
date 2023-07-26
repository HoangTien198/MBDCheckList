using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.TemperatureHumidity.Controllers
{
    public class TemperatureHumidityController : Controller
    {
        // GET: TemperatureHumidity/TemperatureHumidity
        public ActionResult TH_Monitoring_F17()
        {
            return View();
        }
    }
}