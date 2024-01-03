using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using CPDCheckList.Web.Areas.Lable.Data;
using CPDCheckList.Web.Areas.RutKiem;
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
                #region Validate Date Time for Get Data
                DateTime startDate;
                if (Date < 5 && Date != -1)
                {
                    if (Month == 1)
                    {
                        startDate = new DateTime(Year - 1, 12, 1);
                    }
                    else
                    {
                        startDate = new DateTime(Year, Month - 1, 1);
                    }
                }
                else startDate = new DateTime(Year, Month, 1);
                DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));
                #endregion

                List<LableDataFlow> data = db.LableDataFlows.OrderByDescending(o => o.DateTime).ToList();

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
                #region Validate Data
                string messageCheckData = CheckData(lableDataFlow);
                if (!string.IsNullOrEmpty(messageCheckData)) return Json(new { status = false, message = messageCheckData });
                #endregion

                #region Save Image
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
                #endregion

                #region Making Data
                User_Lb user = GetSessionUser();
                if (user == null) return Json(new { status = false, message = "Cannot find login user." });

                LableDataFlow_Status lableDataFlow_Status = new LableDataFlow_Status
                {
                    Id = Guid.NewGuid(),
                    Status = "Pending",
                    IdUserCreate = user.UserId
                };

                lableDataFlow.IdStatus = lableDataFlow_Status.Id;
                #endregion

                #region Save Data to DB
                db.LableDataFlows.Add(lableDataFlow);
                db.LableDataFlow_Status.Add(lableDataFlow_Status);
                db.SaveChanges();
                #endregion

                #region Return Data
                LableDataFlow returnData = db.LableDataFlows.FirstOrDefault(dt => dt.IdStatus == lableDataFlow.IdStatus);
                returnData.LableDataFlow_Status.UserCreate = db.User_Lb.FirstOrDefault(us => us.UserId == returnData.LableDataFlow_Status.IdUserCreate);

                string[] emptyArray = new string[0];
                string content = Commons.SendMailNew.NewMail(Commons.LabelMail.CreateChecklistEmail(Commons.ListMail.MAIL_LABEL, returnData));               
                Commons.SendMailNew.SendMail(Commons.ListMail.MAIL_LABEL, emptyArray, "Bieu luu trinh moi da duoc tao - Special Data Management", content);

                return Json(new { status = true, data = returnData });
                #endregion
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult UpdateCheckList(LableDataFlow lableDataFlow, HttpPostedFileBase BeginCodeImage, HttpPostedFileBase EndCodeImage)
        {
            // Pending, LineLeader Confirm, LineLeader Reject, IPQC Confirm, IPQC Reject
            try
            {
                #region Validadte Data
                string messageCheckData = CheckData(lableDataFlow);
                if (!string.IsNullOrEmpty(messageCheckData)) return Json(new { status = false, message = messageCheckData });
                #endregion

                #region Get Old Data
                LableDataFlow beforData = db.LableDataFlows.FirstOrDefault(lb => lb.Id ==  lableDataFlow.Id);
                #endregion

                #region Merge Old & New Data
                lableDataFlow.IdStatus = beforData.IdStatus;
                lableDataFlow.LableDataFlow_Status = beforData.LableDataFlow_Status;
                #endregion

                #region Check & Save New Image
                string rootPath = "";
                {
                    if (!string.IsNullOrEmpty(beforData.BeginCodeImage))
                    {
                        rootPath = CutStringFromStartToKey(beforData.BeginCodeImage, @"\Begin");
                        lableDataFlow.BeginCodeImage = beforData.BeginCodeImage;
                    }
                    else if (!string.IsNullOrEmpty(beforData.EndCodeImage))
                    {
                        rootPath = CutStringFromStartToKey(beforData.EndCodeImage, @"\End");
                        lableDataFlow.EndCodeImage = beforData.EndCodeImage;
                    }
                    else
                    {
                        rootPath = Server.MapPath($"/Areas/Lable/Data/ImageData/{Guid.NewGuid()}");
                        Directory.CreateDirectory(rootPath);
                    }
                }

                // Save Image
                {
                    try
                    {
                        if (BeginCodeImage.ContentLength > 0)
                        {
                            string savePath = Path.Combine(rootPath, $"Begin{Path.GetExtension(BeginCodeImage.FileName)}");
                            BeginCodeImage.SaveAs(savePath);
                            lableDataFlow.BeginCodeImage = savePath;
                        }
                    }
                    catch { }

                    try
                    {
                        if (EndCodeImage.ContentLength > 0)
                        {
                            string savePath = Path.Combine(rootPath, $"End{Path.GetExtension(EndCodeImage.FileName)}");
                            EndCodeImage.SaveAs(savePath);
                            lableDataFlow.EndCodeImage = savePath;
                        }
                    }
                    catch { }
                }
                #endregion

                #region Save New Data to DB
                db.LableDataFlows.AddOrUpdate(lableDataFlow);
                db.SaveChanges();
                #endregion

                #region Return Data
                return Json(new { status = true, data = lableDataFlow });
                #endregion
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
                if (lable != null)
                {
                    return Json(new { status = true, data = lable }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { status = false, message = "Không tìm thấy dữ liệu." }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetSaveData()
        {
            try 
            {
                List<LableDataFlow_Data> datas = db.LableDataFlow_Data.ToList();

                return Json(new {status = true, data = datas}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult DeleteCheckList(int Id)
        {
            try
            {
                var record = db.LableDataFlows.FirstOrDefault(r => r.Id == Id);
                db.LableDataFlows.Remove(record);
                db.SaveChanges();
                return Json(new { status = true}, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Confirm(int Id, string Mail)
        {
            try
            {
                User_Lb user = GetSessionUser();
                LableDataFlow lable = db.LableDataFlows.FirstOrDefault(lb => lb.Id == Id);

                if (user.RoleId == 2) // line leader
                {
                    lable.LableDataFlow_Status.IdLineLeader = user.UserId;
                    lable.LableDataFlow_Status.Status = "LineLeader Confirm";

                    string[] emptyArray = new string[0];
                    string content = Commons.SendMailNew.NewMail(Commons.LabelMail.CreateChecklistEmail(Mail, lable));
                    Commons.SendMailNew.SendMail(Mail, emptyArray, "Bieu luu trinh moi can duoc phe duyet - Special Data Management System", content);
                } 
                else if (user.RoleId == 3) // ipqc
                {
                    lable.LableDataFlow_Status.IdIPQC = user.UserId;
                    lable.LableDataFlow_Status.Status = "IPQC Confirm";

                    string[] emptyArray = new string[0];
                    string content = Commons.SendMailNew.NewMail(Commons.LabelMail.ConfirmEmail(Commons.ListMail.MAIL_LABEL, lable));
                    Commons.SendMailNew.SendMail(Commons.ListMail.MAIL_LABEL, emptyArray, "Bieu luu trinh da duoc phe duyet - Special Data Management System", content);
                }

                db.LableDataFlows.AddOrUpdate(lable);
                db.SaveChanges();

                return Json(new { status = true, data = lable });
            }
            catch (Exception e)
            {
                return Json(new { status = false, message = e.Message });
            }
        }
        public JsonResult Reject(int Id, string Note)
        {
            try
            {
                User_Lb user = GetSessionUser();
                LableDataFlow lable = db.LableDataFlows.FirstOrDefault(lb => lb.Id == Id);
                lable.LableDataFlow_Status.Note = Note;

                if (user.RoleId == 2) // line leader
                {
                    lable.LableDataFlow_Status.IdLineLeader = user.UserId;
                    lable.LableDataFlow_Status.Status = "LineLeader Reject";

                    string[] emptyArray = new string[0];
                    string content = Commons.SendMailNew.NewMail(Commons.LabelMail.RejectEmail(Commons.ListMail.MAIL_LABEL, lable));
                    Commons.SendMailNew.SendMail(Commons.ListMail.MAIL_LABEL, emptyArray, "Bieu luu trinh da bi tu choi - Special Data Management System", content);
                }
                else if (user.RoleId == 3) // ipqc
                {
                    lable.LableDataFlow_Status.IdIPQC = user.UserId;
                    lable.LableDataFlow_Status.Status = "IPQC Reject";

                    string[] emptyArray = new string[0];
                    string content = Commons.SendMailNew.NewMail(Commons.LabelMail.RejectEmail(Commons.ListMail.MAIL_LABEL, lable));
                    Commons.SendMailNew.SendMail(Commons.ListMail.MAIL_LABEL, emptyArray, "Bieu luu trinh da bi tu choi - Special Data Management System", content);
                }              

                db.LableDataFlows.AddOrUpdate(lable);
                db.SaveChanges();

                return Json(new { status = true, data = lable });
            }
            catch (Exception e)
            {
                return Json(new { status = false, message = e.Message });
            }
        }

        // Function
        private string CheckData(LableDataFlow lableDataFlow)
        {
            try
            {
                #region Validate Data
                if (string.IsNullOrEmpty(lableDataFlow.Location.Trim())) return "[Tên xưởng] chưa được nhập";
                if (lableDataFlow.DateTime == null) return "[Ngày tạo] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.Shift.Trim())) return "[Ca làm việc] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.MO)) return "[MO] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.ProductName)) return "[Tên sản phẩm] chưa được nhập";
                if (lableDataFlow.MO_Num == null) return "[Tổng công lệnh] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.LableCode)) return "[Mã liệu Lable] chưa được nhập";
                if (string.IsNullOrEmpty(lableDataFlow.LableTable)) return "[Bảng ghi chép] chưa được nhập";
                #endregion

                #region Save Important Data
                var propertiesToCheck = new List<(string Name, string Type)>
                    {
                        (lableDataFlow.MO, "MO"),
                        (lableDataFlow.ProductName, "ProductName"),
                        (lableDataFlow.LableCode, "LableCode"),
                        (lableDataFlow.LableTable, "LableTable")
                    };

                foreach (var property in propertiesToCheck)
                {
                    if (!db.LableDataFlow_Data.Any(d => d.Name == property.Name && d.Type == property.Type))
                    {
                        db.LableDataFlow_Data.Add(new LableDataFlow_Data { Name = property.Name, Type = property.Type });
                    }
                }             
                #endregion

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
        private string CutStringFromStartToKey(string input, string search)
        {
            int startIndex = input.IndexOf(search);

            if (startIndex != -1)
            {
                string result = input.Substring(0, startIndex);
                return result;
            }
            else
            {
                return null;
            }
        }
    }
}