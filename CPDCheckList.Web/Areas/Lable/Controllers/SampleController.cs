using CPDCheckList.Web.Areas.Lable.Entities;
using CPDCheckList.Web.Commons;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.Lable.Controllers
{
    public class SampleController : Controller
    {
        LabelSampleEntities db = new LabelSampleEntities();
        // GET: Lable/Sample
        public ActionResult Index()
        {
            return View();
        }

        // GET List Data Sample
        public ActionResult GetLabelSamples(string Location, int Year, int Month, int Date)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;

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

                //List<LabelSample> data = db.LabelSamples.Where(cl => cl.CreatedDate >= startDate && cl.CreatedDate <= endDate && cl.Location == Location)
                //    .Include(cl => cl.LabelSampleStatus)
                //    .OrderByDescending(o => o.CreatedDate)
                //    .ToList();

                List<LabelSample> data = db.LabelSamples.Where(cl => cl.Location == Location)
                    .Include(cl => cl.LabelSampleStatus)
                    .OrderByDescending(o => o.CreatedDate)
                    .ToList();
                return Json(new { status = true, data = JsonSerializer.Serialize(data) }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // POST Add new Label
        public JsonResult NewLabelSample()
        {
            try
            {
                var form = Request.Form;
                var files = Request.Files;

                LabelSample LabelSample = new LabelSample
                {
                    ProductName = form["ProductName"],
                    CreatedDate = DateTime.Parse(form["CreatedDate"]),
                    ValidDate = DateTime.Parse(form["ValidDate"]),
                    MO = form["MO"],
                    Note = form["Note[0]"] + "," + form["Note[1]"] + "," + form["Note[2]"],
                    Location = form["Location"],
                    IsHasKey = bool.Parse(form["IsHasKey"])
                };

                Guid folerName = Guid.NewGuid();

                #region FoxconnLabel
                if (form.AllKeys.Any(k => k.Contains("FoxconnLabel")))
                {
                    FoxconnLabel label = new FoxconnLabel();
                    foreach (string key in form.AllKeys.Where(k => k.Contains("FoxconnLabel")))
                    {
                        if (key.Contains("[IsBarCode]")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("[CustomerNote]")) label.CustomerNote = form[key];
                        if (key.Contains("[MadeIn]")) label.MadeIn = form[key];
                        if (key.Contains("[LableRev]")) label.LableRev = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];
                    }
                    if (files.AllKeys.Any(k => k.Contains("FoxconnLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("FoxconnLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("FoxconnLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image Foxconn Label failed." });
                        }
                    }

                    db.FoxconnLabels.Add(label);

                    LabelSample.IdFoxconnLabel = label.Id;
                    LabelSample.FoxconnLabel = label;
                }
                #endregion

                #region SNLabel
                if (form.AllKeys.Any(k => k.Contains("SNLabel")))
                {
                    SNLabel label = new SNLabel();
                    foreach (string key in form.AllKeys.Where(k => k.Contains("SNLabel")))
                    {
                        if (key.Contains("[IsBarCode]")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("[TimeChangeMethod]")) label.TimeChangeMethod = form[key];
                        if (key.Contains("[FixedCode]")) label.FixedCode = form[key];
                        if (key.Contains("[RangeCode]")) label.RangeCode = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];
                    }
                    if (files.AllKeys.Any(k => k.Contains("SNLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("SNLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("SNLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image SN Label failed." });
                        }
                    }

                    db.SNLabels.Add(label);

                    LabelSample.IdSNLabel = label.Id;
                    LabelSample.SNLabel = label;
                }
                #endregion

                #region MacIDLabel
                if (form.AllKeys.Any(k => k.Contains("MacIDLabel")))
                {
                    MacIDLabel label = new MacIDLabel();
                    foreach (string key in form.AllKeys.Where(k => k.Contains("MacIDLabel")))
                    {
                        if (key.Contains("[IsBarCode]")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("[MacID]")) label.MacID = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];
                    }
                    if (files.AllKeys.Any(k => k.Contains("MacIDLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("MacIDLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("MacIDLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image Mac ID Label failed." });
                        }
                    }

                    db.MacIDLabels.Add(label);

                    LabelSample.IdMacIDLabel = label.Id;
                    LabelSample.MacIDLabel = label;
                }
                #endregion

                #region Current Label
                if (form.AllKeys.Any(k => k.Contains("CurrentLabel")))
                {
                    CurrentLabel label = new CurrentLabel();
                    foreach (string key in form.AllKeys.Where(k => k.Contains("CurrentLabel")))
                    {
                        if (key.Contains("[LabelName]")) label.LabelName = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];
                    }
                    if (files.AllKeys.Any(k => k.Contains("CurrentLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("CurrentLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("CurrentLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image Current Label failed." });
                        }
                    }

                    db.CurrentLabels.Add(label);

                    LabelSample.IdCurrentLabel = label.Id;
                    LabelSample.CurrentLabel = label;
                }
                #endregion

                #region Pdf
                if (files.AllKeys.Any(k => k.Contains("PdfFile")))
                {
                    string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("PdfFile"));
                    HttpPostedFileBase file = Request.Files[fileKey];

                    string SavePath = SavePfd(file, DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));
                    if (!string.IsNullOrEmpty(SavePath))
                    {
                        
                        LabelSample.FilePath = SavePath;
                    }
                    else
                    {
                        return Json(new { status = false, message = "Save image Current Label failed." });
                    }
                }
                #endregion

                #region NoteImage
                if (files.AllKeys.Any(k => k.Contains("NoteImage")))
                {
                    string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("NoteImage"));
                    HttpPostedFileBase file = Request.Files[fileKey];

                    string SavePath = SaveNoteImage(file, DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));
                    if (!string.IsNullOrEmpty(SavePath))
                    {

                        LabelSample.NotePath = SavePath;
                    }
                    else
                    {
                        return Json(new { status = false, message = "Save image failed." });
                    }
                }
                #endregion

                #region Label Sample Status
                User_LS user = GetSessionUser();
                LabelSampleStatus status = new LabelSampleStatus();
                status.IdUserCreated = user.UserId;                
                status.Status = "Pending";
                db.LabelSampleStatus1.Add(status);
              
                LabelSample.IdLabelSampleStatus = status.Id;
                LabelSample.LabelSampleStatus = status;

                db.LabelSamples.Add(LabelSample);
                #endregion

                #region Send Mail
                LabelSample.LabelSampleStatus.UserCreated = db.User_LS.FirstOrDefault(u => u.UserId == LabelSample.LabelSampleStatus.IdUserCreated);

                string[] ccList = new string[0];

                // PQE
                string EmailContentPQE = Commons.SampleMail.CreateChecklistEmail("lena.sh.ruan@mail.foxconn.com", LabelSample);
                string SystemFormPQE = Commons.SendMailNew.NewMail(EmailContentPQE);
                Commons.SendMailNew.SendMail("lena.sh.ruan@mail.foxconn.com", ccList, "New Label Sample - Special Data Management System", SystemFormPQE);

                // PE
                string EmailContentPE = Commons.SampleMail.CreateChecklistEmail("jax.fw.ruan@mail.foxconn.com", LabelSample);
                string SystemFormPE = Commons.SendMailNew.NewMail(EmailContentPE);
                Commons.SendMailNew.SendMail("jax.fw.ruan@mail.foxconn.com", ccList, "New Label Sample - Special Data Management System", SystemFormPE);

                #endregion

                db.SaveChanges();
                status.UserCreated = user;

                return Json(new { status = true , data = JsonSerializer.Serialize(LabelSample)});
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }

        // GET Get Label
        public JsonResult GetLabelSample(int Id)
        {
            try
            {
                LabelSample label = db.LabelSamples.FirstOrDefault(l => l.Id == Id);
                if(label != null)
                {
                    return Json(new { status = true, label = JsonSerializer.Serialize(label) }, JsonRequestBehavior.AllowGet); 
                }
                else
                {
                    return Json(new { status = false, message = "Label sample not found." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message}, JsonRequestBehavior.AllowGet);
            }
        }

        // POST Update new Label
        public JsonResult UpdateLabelSample(int Id)
        {
            try
            {
                var form = Request.Form;
                var files = Request.Files;

                LabelSample LabelSample = db.LabelSamples.FirstOrDefault(lb => lb.Id == Id);

                LabelSample.ProductName = form["ProductName"];
                LabelSample.CreatedDate = DateTime.Parse(form["CreatedDate"]);
                LabelSample.ValidDate = DateTime.Parse(form["ValidDate"]);
                LabelSample.MO = form["MO"];
                LabelSample.Note = form["Note[0]"] + "," + form["Note[1]"] + "," + form["Note[2]"];
                LabelSample.Location = form["Location"];
                LabelSample.IsHasKey = bool.Parse(form["IsHasKey"]);

                Guid folerName = Guid.NewGuid();

                #region FoxconnLabel
                if (form.AllKeys.Any(k => k.Contains("FoxconnLabel")))
                {
                    FoxconnLabel label = new FoxconnLabel();
                    if (LabelSample.FoxconnLabel != null) label = LabelSample.FoxconnLabel;

                    // Data
                    foreach (string key in form.AllKeys.Where(k => k.Contains("FoxconnLabel")))
                    {
                        if (key.Contains("[IsBarCode]")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("[CustomerNote]")) label.CustomerNote = form[key];
                        if (key.Contains("[MadeIn]")) label.MadeIn = form[key];
                        if (key.Contains("[LableRev]")) label.LableRev = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];

                        if (key.Contains("[LabelImagePath]") && form[key] == "Remove") label.LabelImagePath = null;
                    }

                    // File Image
                    if (files.AllKeys.Any(k => k.Contains("FoxconnLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("FoxconnLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("FoxconnLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image Foxconn Label failed." });
                        }
                    }

                    db.FoxconnLabels.AddOrUpdate(label);
                }
                else
                {
                    LabelSample.IdFoxconnLabel = null;
                    LabelSample.FoxconnLabel = null;
                }
                #endregion

                #region SNLabel
                if (form.AllKeys.Any(k => k.Contains("SNLabel")))
                {
                    SNLabel label = new SNLabel();
                    if (LabelSample.SNLabel != null) label = LabelSample.SNLabel;

                    // Data
                    foreach (string key in form.AllKeys.Where(k => k.Contains("SNLabel")))
                    {
                        if (key.Contains("[IsBarCode]")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("[TimeChangeMethod]")) label.TimeChangeMethod = form[key];
                        if (key.Contains("[FixedCode]")) label.FixedCode = form[key];
                        if (key.Contains("[RangeCode]")) label.RangeCode = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];

                        if (key.Contains("[LabelImagePath]") && form[key] == "Remove") label.LabelImagePath = null;
                    }

                    // File Image
                    if (files.AllKeys.Any(k => k.Contains("SNLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("SNLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("SNLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image SN Label failed." });
                        }
                    }

                    db.SNLabels.AddOrUpdate(label);
                }
                else
                {
                    LabelSample.IdSNLabel = null;
                    LabelSample.SNLabel = null;
                }
                #endregion

                #region MacIDLabel
                if (form.AllKeys.Any(k => k.Contains("MacIDLabel")))
                {
                    MacIDLabel label = new MacIDLabel();
                    if (LabelSample.MacIDLabel != null) label = LabelSample.MacIDLabel;

                    // Data
                    foreach (string key in form.AllKeys.Where(k => k.Contains("MacIDLabel")))
                    {
                        if (key.Contains("[IsBarCode]")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("[MacID]")) label.MacID = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];

                        if (key.Contains("[LabelImagePath]") && form[key] == "Remove") label.LabelImagePath = null;
                    }
                    // File Image
                    if (files.AllKeys.Any(k => k.Contains("MacIDLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("MacIDLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("MacIDLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image Mac ID Label failed." });
                        }
                    }

                    db.MacIDLabels.AddOrUpdate(label);
                }
                else
                {
                    LabelSample.IdMacIDLabel = null;
                    LabelSample.MacIDLabel = null;
                }
                #endregion

                #region CurrentLabel
                if (form.AllKeys.Any(k => k.Contains("CurrentLabel")))
                {
                    CurrentLabel label = new CurrentLabel();
                    if (LabelSample.CurrentLabel != null) label = LabelSample.CurrentLabel;

                    // Data
                    foreach (string key in form.AllKeys.Where(k => k.Contains("CurrentLabel")))
                    {
                        if (key.Contains("[LabelName]")) label.LabelName = form[key];
                        if (key.Contains("[LabelCode]")) label.LabelCode = form[key];
                        if (key.Contains("[CoalPaperSpec]")) label.CoalPaperSpec = form[key];
                        if (key.Contains("[DerivedFrom]")) label.DerivedFrom = form[key];

                        if (key.Contains("[LabelImagePath]") && form[key] == "Remove") label.LabelImagePath = null;
                    }

                    // File Image
                    if (files.AllKeys.Any(k => k.Contains("CurrentLabel")))
                    {
                        string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("CurrentLabel"));
                        HttpPostedFileBase file = Request.Files[fileKey];

                        string SavePath = SaveImage("CurrentLabel", file, folerName.ToString());
                        if (!string.IsNullOrEmpty(SavePath))
                        {
                            label.LabelImagePath = SavePath;
                        }
                        else
                        {
                            return Json(new { status = false, message = "Save image Current Label failed." });
                        }
                    }

                    db.CurrentLabels.AddOrUpdate(label);
                }
                else
                {
                    LabelSample.IdCurrentLabel = null;
                    LabelSample.CurrentLabel = null;
                }
                #endregion

                #region Pdf
                if (files.AllKeys.Any(k => k.Contains("PdfFile")))
                {
                    string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("PdfFile"));
                    HttpPostedFileBase file = Request.Files[fileKey];

                    string SavePath = SavePfd(file, DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));
                    if (!string.IsNullOrEmpty(SavePath))
                    {
                        
                        LabelSample.FilePath = SavePath;
                    }
                    else
                    {
                        return Json(new { status = false, message = "Save image Current Label failed." });
                    }
                }
                #endregion

                #region Note Image
                if (files.AllKeys.Any(k => k.Contains("NoteImage")))
                {
                    string fileKey = files.AllKeys.FirstOrDefault(k => k.Contains("NoteImage"));
                    HttpPostedFileBase file = Request.Files[fileKey];

                    string SavePath = SaveNoteImage(file, DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));
                    if (!string.IsNullOrEmpty(SavePath))
                    {

                        LabelSample.NotePath = SavePath;
                    }
                    else
                    {
                        return Json(new { status = false, message = "Save image failed." });
                    }
                }
                #endregion

                db.LabelSamples.AddOrUpdate(LabelSample);
                db.SaveChanges();

                return Json(new { status = true, data = JsonSerializer.Serialize(LabelSample) });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }

        // POST Delete Label
        public JsonResult DeleteLabelSample(int Id)
        {
            try
            {
                LabelSample label = db.LabelSamples.FirstOrDefault(l => l.Id == Id);
                if (label != null)
                {
                    db.LabelSamples.Remove(label);
                    db.SaveChanges();
                    return Json(new { status = true});
                }
                else
                {
                    return Json(new { status = false, message = "Label sample not found." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, messase = ex.Message});
            }
        }

        // POST Confirm
        public JsonResult Confirm(int Id, string Mail)
        {
            try
            {
                User_LS user = GetSessionUser();
                LabelSample lable = db.LabelSamples.FirstOrDefault(lb => lb.Id == Id);

                if (user.RoleId == 6) // PQE
                {
                    lable.LabelSampleStatus.IdPQE = user.UserId;
                    lable.LabelSampleStatus.Status = "PQE Confirm";

                    if(lable.LabelSampleStatus.UserTE != null)
                    {
                        lable.LabelSampleStatus.Status = "Confirm";

                        // Label
                        string[] ccList = new string[0];

                        string EmailContentConfirm = Commons.SampleMail.ConfirmEmail(Commons.ListMail.MAIL_LABEL, lable);
                        string SystemFormConfirm = Commons.SendMailNew.NewMail(EmailContentConfirm);
                        Commons.SendMailNew.SendMail(Commons.ListMail.MAIL_LABEL, ccList, "Bieu luu trinh da duoc ky - Special Data Management System", SystemFormConfirm);
                    }
                }
                else if (user.RoleId == 7) // TE
                {
                    lable.LabelSampleStatus.IdTE = user.UserId;
                    lable.LabelSampleStatus.Status = "TE Confirm";

                    if (lable.LabelSampleStatus.UserPQE != null)
                    {
                        lable.LabelSampleStatus.Status = "Confirm";

                        // Label
                        string[] ccList = new string[0];

                        string EmailContentConfirm = Commons.SampleMail.ConfirmEmail(Commons.ListMail.MAIL_LABEL, lable);
                        string SystemFormConfirm = Commons.SendMailNew.NewMail(EmailContentConfirm);
                        Commons.SendMailNew.SendMail(Commons.ListMail.MAIL_LABEL, ccList, "Bieu luu trinh da duoc ky - Special Data Management System", SystemFormConfirm);
                    }
                }

                db.LabelSamples.AddOrUpdate(lable);
                db.SaveChanges();

                return Json(new { status = true, data = JsonSerializer.Serialize(lable) });
            }
            catch (Exception e)
            {
                return Json(new { status = false, message = e.Message });
            }
        }

        // POST Reject
        public JsonResult Reject(int Id, string Note)
        {
            try
            {
                User_LS user = GetSessionUser();
                LabelSample lable = db.LabelSamples.FirstOrDefault(lb => lb.Id == Id);
                lable.LabelSampleStatus.Note = Note;

                if (user.RoleId == 6) // PQE
                {
                    lable.LabelSampleStatus.IdPQE = user.UserId;
                    lable.LabelSampleStatus.Status = "PQE Reject";

                }
                else if (user.RoleId == 7) // TE
                {
                    lable.LabelSampleStatus.IdTE = user.UserId;
                    lable.LabelSampleStatus.Status = "TE Reject";
                }

                // Label
                string[] ccList = new string[0];

                string EmailContentConfirm = Commons.SampleMail.RejectEmail(Commons.ListMail.MAIL_LABEL, lable);
                string SystemFormConfirm = Commons.SendMailNew.NewMail(EmailContentConfirm);
                Commons.SendMailNew.SendMail(Commons.ListMail.MAIL_LABEL, ccList, "Bieu luu trinh chua duoc thong qua - Special Data Management System", SystemFormConfirm);

                db.LabelSamples.AddOrUpdate(lable);
                db.SaveChanges();

                return Json(new { status = true, data = JsonSerializer.Serialize(lable) });
            }
            catch (Exception e)
            {
                return Json(new { status = false, message = e.Message });
            }
        }

        // Other
        private string SaveImage(string type, HttpPostedFileBase file, string folder)
        {
            string rootPath = Server.MapPath($"/Areas/Lable/Data/ImageData/{folder}");
            if (!Directory.Exists(rootPath)) Directory.CreateDirectory(rootPath);

            try
            {
                string savePath = Path.Combine(rootPath, $"{type}{Path.GetExtension(file.FileName)}");
                file.SaveAs(savePath);

                return savePath;
            }
            catch
            {
                return string.Empty;
            }
        }
        private string SavePfd(HttpPostedFileBase file, string folder)
        {
            string rootPath = Server.MapPath($"/Areas/Lable/Data/Pdf/Sample/{folder}");
            if (!Directory.Exists(rootPath)) Directory.CreateDirectory(rootPath);

            try
            {
                string savePath = Path.Combine(rootPath, $"{file.FileName}");
                file.SaveAs(savePath);

                return savePath;
            }
            catch
            {
                return string.Empty;
            }
        }
        private string SaveNoteImage(HttpPostedFileBase file, string folder)
        {
            string rootPath = Server.MapPath($"/Areas/Lable/Data/ImageData/Sample/{folder}");
            if (!Directory.Exists(rootPath)) Directory.CreateDirectory(rootPath);

            try
            {
                string savePath = Path.Combine(rootPath, $"{Guid.NewGuid()}{file.FileName}");
                file.SaveAs(savePath);

                return savePath;
            }
            catch
            {
                return string.Empty;
            }
        }

        private User_LS GetSessionUser()
        {
            try
            {
                AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
                using (LabelSampleEntities db = new LabelSampleEntities())
                {
                    return db.User_LS.FirstOrDefault(u => u.UserId == userLogin.UserId);
                };
            }
            catch
            {
                return null;
            }
        }
    }
}