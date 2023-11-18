using CPDCheckList.Web.Areas.Lable.Data;
using CPDCheckList.Web.Areas.SMT.Entities;
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

                //List<Entities.UnusualMatReq_mt> UnusualMatReqs = db.UnusualMatReq_mt.Where(cl => cl.DateReq >= startDate && cl.DateReq <= endDate && cl.Location == Location).ToList();
                List<Entities.UnusualMatReq_mt> UnusualMatReqs = db.UnusualMatReq_mt.OrderByDescending(o =>o.DateReq).ToList();

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
                List<Entities.User_mt> users = db.User_mt.Where(u => u.RoleId > 7 && u.RoleId < 16).ToList();
                return Json(new {status = true, data = JsonSerializer.Serialize(users)}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Add new request
        public JsonResult NewRequest(UnusualMatReq_mt unusualMatReq)
        {
            try {
                unusualMatReq.UnusualMatReqStatus.Status = "Pending";
                db.UnusualMatReq_mt.Add(unusualMatReq);

                foreach(var sign in unusualMatReq.UnusualMatReqStatus.UnsualMatReqSigns)
                {
                    sign.IdStatus = unusualMatReq.UnusualMatReqStatus.Id;
                    sign.Status = "Pending";
                    sign.User = db.User_mt.FirstOrDefault(u => u.UserId ==  sign.IdUser);
                    sign.Role = db.Role_mt.FirstOrDefault(r => r.RoleId == sign.IdRole);

                    //unusualMatReq.UnusualMatReqStatus.UnsualMatReqSigns.Add(sign);
                }
                unusualMatReq.UnusualMatReqStatus.UserCreated = db.User_mt.FirstOrDefault(u => u.UserId == unusualMatReq.UnusualMatReqStatus.IdUserCreated);
                unusualMatReq.UnusualMatReqStatus = unusualMatReq.UnusualMatReqStatus;

                db.SaveChanges();

                return Json(new { status = true, data = unusualMatReq });
            }
            catch (Exception ex)
            {
                return Json(new {status = false, message = ex.Message});
            }
        }
    }
}