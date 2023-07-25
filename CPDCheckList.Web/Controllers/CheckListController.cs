using CPDCheckList.Web.Commons;
using CPDCheckList.Web.Models.DAO;
using CPDCheckList.Web.Models.EF;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.EnterpriseServices.CompensatingResourceManager;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Controllers
{
    public class CheckListController : Controller
    {
        // GET: CheckList
        public ActionResult Index()
        {
            return View();
        }

        //get All CheckList
        [HttpGet]
        public string GetAllCheckListFirst(string location, int year, int month, int day)
        {
            var clDao = new CheckListDao();
            var lstCheckList = clDao.GetAllVMCheckList(location, year, month, day);
            var result = System.Text.Json.JsonSerializer.Serialize(lstCheckList);
            return result;
        }


        public JsonResult GetCheckListById(int checklistId)
        {
            try
            {
                var clDao = new CheckListDao();
                var result = clDao.GetVMCheckListById(checklistId);
                var jsonResult = System.Text.Json.JsonSerializer.Serialize(result);

                User user = new UserDao().GetById((int) result.TECreatedBy);

                return Json(new { status = 1, Data = jsonResult, User = user.UserFullName }, JsonRequestBehavior.AllowGet);//thành công
            }
            catch (Exception ex)
            {
                return Json(new { status = 0, message = ex.Message }, JsonRequestBehavior.AllowGet);//thất bại

            }
        }
    }
}