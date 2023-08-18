using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.RutKiem.Controllers
{
    public class RutKiemController : Controller
    {
        // GET: RutKiem/RutKiem
        public ActionResult WithDrawal_F17()
        {
            ViewBag.Location = "F17";
            return View();
        }

        public JsonResult GetWithDrawalList(string Location, int Year, int Month, int Date)
        {
            try
            {
                using (WithDrawalEntities db = new WithDrawalEntities())
                {
                    DateTime startDate;
                    if (Date < 5 && Date != -1) startDate = new DateTime(Year, Month - 1, 1);
                    else startDate = new DateTime(Year, Month, 1);
                    DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));

                    List<CheckListRutKiem> data = db.CheckListRutKiems.Where(cl => cl.CreatedDate >= startDate && cl.CreatedDate <= endDate && cl.Location == Location)
                                                                      .OrderByDescending(o => o.CreatedDate).ToList();
                    foreach(CheckListRutKiem check in data)
                    {
                        check.CreatedUser.Password = string.Empty;
                        check.LineLeaderUser.Password = string.Empty;
                    }

                    return Json(new { status = true, data }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AddNewWithDrawal(CheckListRutKiem rutKiem)
        {
            try
            {
                string ValidateString = ValidateData(rutKiem);
                if (ValidateString != string.Empty) { return Json(new { status = false, message = ValidateString }); }

                using (WithDrawalEntities db = new WithDrawalEntities())
                {
                    db.CheckListRutKiems.AddOrUpdate(rutKiem);
                    db.SaveChanges();

                    rutKiem.CreatedUser = db.WdUsers.FirstOrDefault(u => u.UserId == rutKiem.CreatedUserId);
                }
                return Json(new { status = true, data = rutKiem });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }

        public JsonResult GetAWithDrawal(int Id)
        {
            try
            {
                using(WithDrawalEntities db = new WithDrawalEntities())
                {
                    CheckListRutKiem check = db.CheckListRutKiems.FirstOrDefault(c => c.Id == Id);
                    check.LineLeaderUser.Password = string.Empty;
                    check.CreatedUser.Password = string.Empty;

                    return Json(new {status = true, data = check}, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DeleteWithDrawal(int Id)
        {
            try
            {
                using (WithDrawalEntities db = new WithDrawalEntities())
                {
                    CheckListRutKiem check = db.CheckListRutKiems.FirstOrDefault(o => o.Id == Id);
                    db.CheckListRutKiems.Remove(check);
                    db.SaveChanges();

                    return Json(new { status = true }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ApprovedWithDrawal(int Id)
        {
            try
            {
                using (WithDrawalEntities db = new WithDrawalEntities())
                {
                    CheckListRutKiem check = db.CheckListRutKiems.FirstOrDefault(o => o.Id == Id);
                    check.Status = "Approved";
                    check.LineLeaderUser.Password = string.Empty;
                    check.CreatedUser.Password = string.Empty;
                    db.SaveChanges();

                    return Json(new { status = true, data = check }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult RejectWithDrawal(int Id)
        {
            try
            {
                using (WithDrawalEntities db = new WithDrawalEntities())
                {
                    CheckListRutKiem check = db.CheckListRutKiems.FirstOrDefault(o => o.Id == Id);
                    check.Status = "Reject";
                    check.LineLeaderUser.Password = string.Empty;
                    check.CreatedUser.Password = string.Empty;
                    db.SaveChanges();

                    return Json(new { status = true, data = check }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        private string ValidateData(CheckListRutKiem data)
        {
            try
            {
                using (WithDrawalEntities db = new WithDrawalEntities())
                {
                    if (!db.WdUsers.Any(u => u.UserId == data.LineLeaderId))
                    {
                        return "Không tìm thấy dữ liệu của tuyến trưởng. Vui lòng liên hệ bộ phận A-IOT để thêm dữ liệu về tuyến trưởng này.";
                    }

                    var propertiesToCheck = new List<(string Name, string Type)>
                    {
                        (data.MO, "MO"),
                        (data.StampCode, "StampCode"),
                        (data.Model, "Model"),
                        (data.MaterialCode, "MaterialCode"),
                        (data.CheckSum, "CheckSum"),
                        (data.Color, "Color"),
                        (data.MachineName, "MachineName")
                    };

                    foreach (var property in propertiesToCheck)
                    {
                        if (!db.WithDrawalDatas.Any(d => d.Name == property.Name && d.Type == property.Type))
                        {
                            db.WithDrawalDatas.Add(new WithDrawalData { Name = property.Name, Type = property.Type });
                        }
                    }

                    db.SaveChanges();
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public JsonResult GetDataList()
        {
            try
            {
                using (WithDrawalEntities db = new WithDrawalEntities())
                {
                    var listUser = db.WdUsers.Where(u => u.RoleId == 2).Select(u => new
                    {
                        u.UserId,
                        u.UserFullName,
                        u.UserCode,
                        u.RoleId
                    }).ToList();

                    var listData = db.WithDrawalDatas.ToList();

                    return Json(new { status = true, listUser, listData }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}