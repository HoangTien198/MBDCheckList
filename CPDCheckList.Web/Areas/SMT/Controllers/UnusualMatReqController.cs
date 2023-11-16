using CPDCheckList.Web.Areas.Lable.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.SMT.Controllers
{
    public class UnusualMatReqController : Controller
    {
        // GET: SMT/UnusualMatReq
        Entities.UnusualMatReqEntities db = new Entities.UnusualMatReqEntities();
        public ActionResult Index()
        {

            return View();
        }

        public ActionResult GetMatReqs(string Location, int Year, int Month, int Date)
        {
            try
            {
                #region Validate Date Time for Get Data
                DateTime startDate;
                if (Date < 5) startDate = new DateTime(Year, Month - 1, 1);
                else startDate = new DateTime(Year, Month, 1);
                DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));
                #endregion

                List<Entities.UnusualMatReq> UnusualMatReqs = db.UnusualMatReqs.Where(cl => cl.DateReq >= startDate && cl.DateReq <= endDate && cl.Location == Location).ToList();

                return Json(new { status = true, data = JsonSerializer.Serialize(UnusualMatReqs) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetUsers()
        {
            try
            {
                List<Entities.User_MQ> users = db.User_MQ.Where(u => u.RoleId > 7 && u.RoleId < 16).ToList();
                return Json(new {status = true, data = JsonSerializer.Serialize(users)}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}