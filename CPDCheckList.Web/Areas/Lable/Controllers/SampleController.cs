using CPDCheckList.Web.Areas.Lable.Data;
using CPDCheckList.Web.Commons;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
                if (Date < 5) startDate = new DateTime(Year, Month - 1, 1);
                else startDate = new DateTime(Year, Month, 1);
                DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));
                #endregion

                List<LabelSample> data = db.LabelSamples.Where(cl => cl.CreatedDate >= startDate && cl.CreatedDate <= endDate && cl.Location == Location)
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
                    foreach (string key in form.AllKeys)
                    {
                        if (key.Contains("IsBarCode")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("CustumerNote")) label.CustomerNote = form[key];
                        if (key.Contains("MadeIn")) label.MadeIn = form[key];
                        if (key.Contains("LableRev")) label.LableRev = form[key];
                        if (key.Contains("LabelCode")) label.LabelCode = form[key];
                        if (key.Contains("CoalPaperSpec")) label.CoalPaperSpec = form[key];
                        if (key.Contains("DerivedFrom")) label.DerivedFrom = form[key];
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
                    foreach (string key in form.AllKeys)
                    {
                        if (key.Contains("IsBarCode")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("TimeChangeMethod")) label.TimeChangeMethod = form[key];
                        if (key.Contains("FixedCode")) label.FixedCode = form[key];
                        if (key.Contains("RangeCode")) label.RangeCode = form[key];
                        if (key.Contains("LabelCode")) label.LabelCode = form[key];
                        if (key.Contains("CoalPaperSpec")) label.CoalPaperSpec = form[key];
                        if (key.Contains("DerivedFrom")) label.DerivedFrom = form[key];
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
                    foreach (string key in form.AllKeys)
                    {
                        if (key.Contains("IsBarCode")) label.IsBarCode = bool.Parse(form[key]);
                        if (key.Contains("MacID")) label.MacID = form[key];
                        if (key.Contains("LabelCode")) label.LabelCode = form[key];
                        if (key.Contains("CoalPaperSpec")) label.CoalPaperSpec = form[key];
                        if (key.Contains("DerivedFrom")) label.DerivedFrom = form[key];
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
                    foreach (string key in form.AllKeys)
                    {
                        if (key.Contains("LabelName")) label.LabelName = form[key];
                        if (key.Contains("LabelCode")) label.LabelCode = form[key];
                        if (key.Contains("CoalPaperSpec")) label.CoalPaperSpec = form[key];
                        if (key.Contains("DerivedFrom")) label.DerivedFrom = form[key];
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

                #region Label Sample Status
                User_LS user = GetSessionUser();
                LabelSampleStatus status = new LabelSampleStatus();
                status.IdUserCreated = user.UserId;
                status.UserCreated = user;
                status.Status = "Pending";

                db.LabelSampleStatus1.Add(status);
                LabelSample.IdLabelSampleStatus = status.Id;
                LabelSample.LabelSampleStatus = status;
                #endregion

                db.LabelSamples.Add(LabelSample);

                db.SaveChanges();

                return Json(new { status = true , data = JsonSerializer.Serialize(LabelSample)});
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
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