using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CPDCheckList.Web.Areas.Lable.Data;

namespace CPDCheckList.Web.Areas.Lable.Controllers
{
    public class DataFlowController : Controller
    {
        // GET: Lable/DataFlow
        public ActionResult Index()
        {
            ViewBag.Location = "F06";
            return View();
        }

        public JsonResult GetDataFlowList(string Location, int Year, int Month, int Date) 
        {
            try
            {
                using (LableDataFlowEntities db = new LableDataFlowEntities())
                {
                    DateTime startDate;
                    if (Date < 5) startDate = new DateTime(Year, Month - 1, 1);
                    else startDate = new DateTime(Year, Month, 1);
                    DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));

                    List<LableDataFlow> data = db.LableDataFlows.Where(cl => cl.DateTime >= startDate && cl.DateTime <= endDate && cl.Location == Location).OrderByDescending(o => o.DateTime).ToList();

                    return Json(new { status = true, data }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}