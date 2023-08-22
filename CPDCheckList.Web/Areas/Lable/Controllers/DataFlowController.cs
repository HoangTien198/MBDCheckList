using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CPDCheckList.Web.Areas.Lable.Data;
using CPDCheckList.Web.Commons;

namespace CPDCheckList.Web.Areas.Lable.Controllers
{
    public class DataFlowController : Controller
    {
        LableDataFlowEntities db =  new LableDataFlowEntities();
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
                DateTime startDate;
                if (Date < 5) startDate = new DateTime(Year, Month - 1, 1);
                else startDate = new DateTime(Year, Month, 1);
                DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));

                List<LableDataFlow> data = db.LableDataFlows.Where(cl => cl.DateTime >= startDate && cl.DateTime <= endDate && cl.Location == Location).OrderByDescending(o => o.DateTime).ToList();

                return Json(new { status = true, data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult AddNewCheckList(LableDataFlow lableDataFlow, HttpPostedFileBase BeginCodeImage, HttpPostedFileBase EndCodeImage)
        {
            // Pending, LineLeader Confirm, LineLeader Reject, IPQC Confirm, IPQC Reject
            try
            {
                string messageCheckData = CheckData(lableDataFlow);
                if (!string.IsNullOrEmpty(messageCheckData)) return Json(new { status = false, message = messageCheckData });


                string rootPath = Server.MapPath($"/Areas/Lable/Data/ImageData/{Guid.NewGuid()}");
                if (!Directory.Exists(rootPath)) Directory.CreateDirectory(rootPath);

                try
                {
                    string savePath = Path.Combine(rootPath, $"Begin{Path.GetExtension(BeginCodeImage.FileName)}");
                    BeginCodeImage.SaveAs(savePath);
                    lableDataFlow.BeginCodeImage = savePath;
                }
                catch { }

                try
                {
                    string savePath = Path.Combine(rootPath, $"End{Path.GetExtension(EndCodeImage.FileName)}");
                    EndCodeImage.SaveAs(savePath);
                    lableDataFlow.EndCodeImage = savePath;
                }
                catch { }

                User_Lb user = GetSessionUser();
                if (user == null) return Json(new { status = false, message = "Cannot find login user." });

                LableDataFlow_Status lableDataFlow_Status = new LableDataFlow_Status
                {
                    Id = Guid.NewGuid(),
                    Status = "Pending",
                    IdUserCreate = user.UserId
                };

                lableDataFlow.IdStatus = lableDataFlow_Status.Id;

                db.LableDataFlows.Add(lableDataFlow);
                db.LableDataFlow_Status.Add(lableDataFlow_Status);
                db.SaveChanges();

                LableDataFlow returnData = db.LableDataFlows.FirstOrDefault(dt => dt.IdStatus == lableDataFlow.IdStatus);
                returnData.LableDataFlow_Status.UserCreate = db.User_Lb.FirstOrDefault(us => us.UserId == returnData.LableDataFlow_Status.IdUserCreate);

                return Json(new { status = true, data = returnData });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDataFlow(int Id)
        {
            try
            {
                LableDataFlow lable = db.LableDataFlows.FirstOrDefault(lb => lb.Id == Id);
                return Json(new { status = true, data = lable}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // Function
        private string CheckData(LableDataFlow lableDataFlow)
        {
            try
            {
                if (string.IsNullOrEmpty(lableDataFlow.Location.Trim())) return "[Tên xưởng] chưa được nhập";
                if (lableDataFlow.DateTime == null) return "[Ngày tạo] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.Shift.Trim())) return "[Ca làm việc] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.MO)) return "[MO] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.ProductName)) return "[Tên sản phẩm] chưa được nhập";
                if (lableDataFlow.MO_Num == null) return "[Tổng công lệnh] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.LableCode)) return "[Mã liệu Lable] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.LableTable)) return "[Bảng ghi chép] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.BeginCode)) return "[Số đầu] chưa được nhập";
                if (lableDataFlow.LablePrintNum == null) return "[Số lượng in Lable] chưa được nhập";
                if (lableDataFlow.MOPrintNum == null) return "[Số lượng in công lệnh] chưa được nhập";

                return string.Empty;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        private User_Lb GetSessionUser()
        {
            try
            {
                AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
                using (LableDataFlowEntities db = new LableDataFlowEntities())
                {
                    return db.User_Lb.FirstOrDefault(u => u.UserId == userLogin.UserId);
                };               
            }
            catch
            {
                return null;
            }
        }
    }
}