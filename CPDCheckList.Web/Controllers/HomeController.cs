using CPDCheckList.Web.Models.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        /// <summary>
        /// Hàm lấy tất cả check list ontime theo checkListId
        /// </summary>
        /// <param name="checkListId"></param>
        /// <returns></returns>
        [HttpGet]
        public string GetAllCheckListOnTime(int checkListFirstId)
        {
            var clOnTimeDao = new CheckListOnTimeDao();
            var result = clOnTimeDao.GetAllByCheckListId(checkListFirstId);
            var jsonResult = JsonSerializer.Serialize(result);
            return jsonResult;
        }
    }
}
