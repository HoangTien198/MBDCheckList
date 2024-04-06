using CPDCheckList.Web.Areas.ICColor.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.ICColor.Controllers
{
    public class ICColorManagerController : Controller
    {
        // GET: ICColor/ICColorManager
        public ActionResult Manager()
        {
            return View();
        }

        public JsonResult GetICColors()
        {
            try
            {
                var result = R_ICColor.GetICColors();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new {status = false, message = ex}, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetICColor(int Id)
        {
            try
            {
                var result =R_ICColor.GetICColor(Id);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetUsers()
        {
            try
            {
                var result = R_ICColor.GetUsers();

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult CreateICColor(Data.ICColor icColor)
        {
            try
            {
                var result = R_ICColor.CreateICColor(icColor);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult UpdateICColor(Data.ICColor icColor)
        {
            try
            {
                var result = R_ICColor.UpdateICColor(icColor);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DeleteICColor(int Id)
        {
            try
            {
                var result = R_ICColor.DeleteICColor(Id);

                return Json(new { status = true, data = result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}