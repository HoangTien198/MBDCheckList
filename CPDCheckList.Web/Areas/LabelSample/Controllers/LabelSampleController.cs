using CPDCheckList.Web.Areas.LabelSample.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.LabelSample.Controllers
{
    public class LabelSampleController : Controller
    {
        // GET: LabelSample/LabelSample
        LabelSampleEntities db = new LabelSampleEntities();
        public ActionResult LabelSample()
        {
            return View();
        }

        // GET List Data Sample
        public ActionResult GetLabelSamples(string Location, int Year, int Month, int Date)
        {
            try
            {
                #region Validate Date Time for Get Data
                DateTime startDate;
                if (Date < 5) startDate = new DateTime(Year, Month - 1, 1);
                else startDate = new DateTime(Year, Month, 1);
                DateTime endDate = new DateTime(Year, Month, DateTime.DaysInMonth(Year, Month));
                #endregion

                List<Entities.LabelSample> data = db.LabelSamples.Where(cl => cl.CreatedDate >= startDate && cl.CreatedDate <= endDate && cl.Location == Location).OrderByDescending(o => o.CreatedDate).ToList();
                return Json(new { status = true, data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}