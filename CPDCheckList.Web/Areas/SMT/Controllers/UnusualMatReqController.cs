using CPDCheckList.Web.Areas.Lable.Data;
using CPDCheckList.Web.Areas.SMT.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Runtime.CompilerServices;
using System.Data.Entity.Migrations;

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

                return Json(new { status = true, data = UnusualMatReqs }, JsonRequestBehavior.AllowGet);
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
                return Json(new {status = true, data = users }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetRequest(int Id)
        {
            try
            {
                var request = db.UnusualMatReq_mt.FirstOrDefault(r => r.Id == Id);
                if(request != null)
                {
                    return Json(new {status = true, request}, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "Could not find Request." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Add new request
        public JsonResult NewRequest(FormCollection formData)
        {
            try {
                var jsonstring = formData["unusualMatReq"];
                UnusualMatReq_mt unusualMatReq = JsonConvert.DeserializeObject<UnusualMatReq_mt>(jsonstring);

                var file = Request.Files.Get("file");
                if (file != null)
                {
                    var path = Server.MapPath($"/Areas/SMT/Data/Files/{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}");
                    var filename = System.IO.Path.GetFileName(file.FileName);
                    var savepath = System.IO.Path.Combine(path, filename);
                    file.SaveAs(savepath);

                    unusualMatReq.FilePath = savepath;
                }

                unusualMatReq.UnusualMatReqStatus.First().Status = "Pending";
                int IdUserCreated = unusualMatReq.UnusualMatReqStatus.First().IdUserCreated ?? 0;
                unusualMatReq.UnusualMatReqStatus.First().UserCreated = db.User_mt.FirstOrDefault( u => u.UserId == IdUserCreated);
                db.UnusualMatReq_mt.Add(unusualMatReq);

                db.SaveChanges();

                return Json(new { status = true, data = unusualMatReq });
            }
            catch (Exception ex)
            {
                return Json(new {status = false, message = ex.Message});
            }
        }

        // DELETE : Delete
        public JsonResult DeleteRequest(int Id)
        {
            try
            {
                var request = db.UnusualMatReq_mt.FirstOrDefault(r => r.Id == Id);
                if (request != null)
                {
                    db.UnusualMatReq_mt.Remove(request);
                    db.SaveChanges();
                    return Json(new { status = true, request }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "Could not find Request." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // Sign
        public JsonResult Approve(int IdRequest, int IdUser)
        {
            try
            {
                var request = db.UnusualMatReq_mt.FirstOrDefault(r => r.Id == IdRequest);
                if(request != null)
                {
                    var user = db.User_mt.FirstOrDefault(u => u.UserId == IdUser);
                    var status = request.UnusualMatReqStatus.ToList()[0];
                    var sign = status.UnsualMatReqSigns.FirstOrDefault(s => (s.IdUser == 178 ? s.IdRole == user.RoleId : s.IdUser == IdUser));
                    sign.Status = "Approved";
                    sign.DateTime = DateTime.Now;
                    sign.IdUser = IdUser;


                    if (!status.UnsualMatReqSigns.Any(s => s.Status != "Approve")) // Nếu không có sign status nào khác "Approve" thì trả về true
                    {
                        status.Status = "Approved";
                    }

                    db.UnusualMatReq_mt.AddOrUpdate(request);
                    db.SaveChanges();
                }

                return Json(new { status = true, request });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }
        public JsonResult Reject(int IdRequest, int IdUser, string note)
        {
            try
            {
                var request = db.UnusualMatReq_mt.FirstOrDefault(r => r.Id == IdRequest);
                if (request != null)
                {
                    var user = db.User_mt.FirstOrDefault(u => u.UserId == IdUser);
                    var status = request.UnusualMatReqStatus.ToList()[0];
                    var sign = status.UnsualMatReqSigns.FirstOrDefault(s => (s.IdUser == 178 ? s.IdRole == user.RoleId : s.IdUser == IdUser));
                    sign.Status = "Rejected";
                    sign.DateTime = DateTime.Now;
                    sign.IdUser = IdUser;
                    sign.Note = note;


                    status.Status = "Rejected";

                    db.UnusualMatReq_mt.AddOrUpdate(request);
                    db.SaveChanges();
                }

                return Json(new { status = true, request });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }

    }
}