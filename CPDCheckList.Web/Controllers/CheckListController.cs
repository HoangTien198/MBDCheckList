using CPDCheckList.Web.Models.DAO;
using System;
using System.Collections.Generic;
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
            var result = JsonSerializer.Serialize(lstCheckList);
            return result;
        }


        public string GetCheckListById(int checklistId)
        {
            var clDao = new CheckListDao();
            var result = clDao.GetVMCheckListById(checklistId);
            var jsonResult = JsonSerializer.Serialize(result);
            return jsonResult;
        }
    }
}