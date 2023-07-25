using System;
using System.Collections.Generic;
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

        //public JsonResult GetWithDrawalList(string Location, int Year, int Month, int Date)
        //{
        //    try
        //    {
        //        using (WithDrawalEntities db = new WithDrawalEntities())
        //        {
        //            DateTime startDate;
        //            if (Date < 5 && Date != -1) startDate = new DateTime(Year, Month - 1, 1);
        //            else startDate = new DateTime(Year, Month, 1);
        //            DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));
                    
        //            List<CheckListRutKiem> data = db.CheckListRutKiems.Where(cl => cl.CreatedDate >= startDate && cl.CreatedDate <= endDate && cl.Location == Location).ToList();

        //            return Json(new { status = true, data }, JsonRequestBehavior.AllowGet);
        //        }                
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //public JsonResult AddNewWithDrawal(CheckListRutKiem rutKiem)
        //{
        //    try
        //    {
        //        string ValidateString = ValidateData(rutKiem);
        //        if (ValidateString != string.Empty) { return Json(new { status = false, message = ValidateString }); }

        //        using (WithDrawalEntities db = new WithDrawalEntities())
        //        {
        //            db.CheckListRutKiems.Add(rutKiem);
        //            db.SaveChanges();
        //        }
        //        return Json(new { status = true, data = rutKiem });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { status = false, message = ex.Message });
        //    }
        //}
        //private string ValidateData(CheckListRutKiem data)
        //{
        //    try
        //    {
        //        using (WithDrawalEntities db = new WithDrawalEntities())
        //        {
        //            if (!db.WdUsers.Any(u => u.Username == data.LineLeaderId))
        //            {
        //                return "Không tìm thấy dữ liệu của tuyến trưởng. Vui lòng liên hệ bộ phận A-IOT để thêm dữ liệu về tuyến trưởng này.";
        //            }

        //            if (!db.WithDrawalDatas.Any(d => d.Name == data.MO && d.Type == "MO"))
        //            {
        //                db.WithDrawalDatas.Add(new WithDrawalData { Name = data.MO, Type = "MO" });
        //            }
        //            if (!db.WithDrawalDatas.Any(d => d.Name == data.StampCode && d.Type == "StampCode"))
        //            {
        //                db.WithDrawalDatas.Add(new WithDrawalData { Name = data.StampCode, Type = "StampCode" });
        //            }
        //            if (!db.WithDrawalDatas.Any(d => d.Name == data.Model && d.Type == "Model"))
        //            {
        //                db.WithDrawalDatas.Add(new WithDrawalData { Name = data.Model, Type = "Model" });
        //            }
        //            if (!db.WithDrawalDatas.Any(d => d.Name == data.MaterialCode && d.Type == "MaterialCode"))
        //            {
        //                db.WithDrawalDatas.Add(new WithDrawalData { Name = data.MaterialCode, Type = "MaterialCode" });
        //            }
        //            if (!db.WithDrawalDatas.Any(d => d.Name == data.CheckSum && d.Type == "CheckSum"))
        //            {
        //                db.WithDrawalDatas.Add(new WithDrawalData { Name = data.CheckSum, Type = "CheckSum" });
        //            }
        //            if (!db.WithDrawalDatas.Any(d => d.Name == data.Color && d.Type == "Color"))
        //            {
        //                db.WithDrawalDatas.Add(new WithDrawalData { Name = data.Color, Type = "Color" });
        //            }
        //            if (!db.WithDrawalDatas.Any(d => d.Name == data.MachineName && d.Type == "MachineName"))
        //            {
        //                db.WithDrawalDatas.Add(new WithDrawalData { Name = data.MachineName, Type = "MachineName" });
        //            }

        //            db.SaveChanges();
        //        }
        //        return string.Empty;
        //    }
        //    catch (Exception ex)
        //    {
        //        return ex.Message;
        //    }
        //}
        //public JsonResult GetDataList()
        //{
        //    try
        //    {
        //        using (WithDrawalEntities db = new WithDrawalEntities())
        //        {
        //            var listUser = db.WdUsers.Where(u => u.RoleId < 3).Select(u => new
        //            {
        //                u.UserId,
        //                u.UserFullName,
        //                u.Username,
        //                u.RoleId
        //            }).ToList();

        //            var listData = db.WithDrawalDatas.ToList();

        //            return Json(new { status = true, listUser, listData }, JsonRequestBehavior.AllowGet);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}
    }
}