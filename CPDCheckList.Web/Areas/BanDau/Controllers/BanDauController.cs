using CPDCheckList.Web.Commons;
using CPDCheckList.Web.Models.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CPDCheckList.Web.Areas.BanDau;
using Newtonsoft.Json;
using System.Web.WebSockets;
using CPDCheckList.Web.Models.EF;
using System.EnterpriseServices.CompensatingResourceManager;

namespace CPDCheckList.Web.Areas.BanDau.Controllers
{
    public class BanDauController : Controller
    {
        // GET: BanDau/BanDau
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult F06()
        {
            ViewBag.Location = "F06";
            return View("BanDau");
        }
        public ActionResult F17()
        {
            ViewBag.Location = "F17";
            return View("BanDau");
        }


        [HttpGet]
        public JsonResult GetThisUser()
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            User user = new UserDao().GetById(userLogin.UserId);
            return Json(new { status = 1, Data = user.UserFullName, userId = user.UserId }, JsonRequestBehavior.AllowGet);
        }

        #region IPQC
        [HttpPost]
        public JsonResult IPQCConfirmCheckList(int checkListId)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var checkListDao = new CheckListDao();
            var check = checkListDao.IPQCConfirmCheckList(checkListId, userLogin);
            if (check == 1)
            {
                return Json(new { status = 1, Data = JsonConvert.SerializeObject(checkListDao.GetVMCheckListById(checkListId))});//thành công
            }
            else
            {
                return Json(new { status = 0 });//thất bại

            }
        }
        [HttpPost]
        public JsonResult IPQCRejectCheckList(int checkListId, string iPQCReasonReject)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var checkListDao = new CheckListDao();
            var check = checkListDao.IPQCRejectCheckList(checkListId, iPQCReasonReject, userLogin);
            if (check == 1)
            {
                return Json(new { status = 1, Data = JsonConvert.SerializeObject(checkListDao.GetVMCheckListById(checkListId)) });//thành công
            }
            else
            {
                return Json(new { status = 0 });//thất bại
            }
        }
        [HttpPost]
        public JsonResult ConfirmCheckListOnTimeIPQC(CheckListOnTimeAjaxIPQC checkListOnTime)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var clOnTimeDao = new CheckListOnTimeDao();
            var check = clOnTimeDao.IPQCConfirmCheckListOnTime(checkListOnTime, userLogin);

            Users user = new Users();
            using (var db = new CheckListEntities())
            {
                user = db.Users_.FirstOrDefault(u => u.UserId == userLogin.UserId);

                if (check == 1)
                {
                    return Json(new { status = 1, Data = JsonConvert.SerializeObject(user) });//thành công
                }
                else
                {
                    return Json(new { status = 0 });//thất bại
                }
            }
        }
        #endregion

        #region Line Leader
        [HttpPost]
        public JsonResult ConfirmCheckListLineLeader(int checkListId, string mailSelected)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var checkListDao = new CheckListDao();
            var check = checkListDao.ConfirmCheckList(checkListId, userLogin, mailSelected);
            if (check == 1)
            {
                return Json(new { status = 1, Data = JsonConvert.SerializeObject(checkListDao.GetVMCheckListById(checkListId)) });//thành công
            }
            else
            {
                return Json(new { status = 0 });//thất bại

            }
        }

        [HttpPost]
        public JsonResult RejectCheckListLineLeader(int checkListId, string lineLeaderReasonReject)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var checkListDao = new CheckListDao();
            var check = checkListDao.RejectCheckList(checkListId, lineLeaderReasonReject, userLogin);
            if (check == 1)
            {
                return Json(new { status = 1, Data = JsonConvert.SerializeObject(checkListDao.GetVMCheckListById(checkListId)) });//thành công
            }
            else
            {
                return Json(new { status = 0 });//thất bại
            }
        }
        [HttpPost]
        public JsonResult ConfirmCheckListOnTimeLineLeader(CheckListOnTimeAjaxLineLeader data)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var clOnTimeDao = new CheckListOnTimeDao();
            var check = clOnTimeDao.LineLeaderConfirmCheckListOnTime(data, userLogin);

            Users user = new Users();
            using (var db = new CheckListEntities())
            {
                user = db.Users_.FirstOrDefault(u => u.UserId == userLogin.UserId);

                if (check == string.Empty)
                {
                    return Json(new { status = 1, Data = JsonConvert.SerializeObject(user) });//thành công
                }
                else
                {
                    return Json(new { status = 0, message = check });//thất bại
                }
            }
        }
        #endregion

        #region Worker
        [HttpPost]
        public JsonResult SaveCheckListFirst(CheckListSaveAjax data)
        {
            try
            {
                var checkList = data.checkList;                
                if (string.IsNullOrEmpty(checkList.MO) || string.IsNullOrEmpty(checkList.ChecklistCreateDate) || string.IsNullOrEmpty(checkList.ShiftWork) || string.IsNullOrEmpty(checkList.ModelName) || string.IsNullOrEmpty(checkList.ProgramName) || string.IsNullOrEmpty(checkList.Checksum) || string.IsNullOrEmpty(checkList.MaterialCode) || string.IsNullOrEmpty(checkList.MaterialCodeProducer) || string.IsNullOrEmpty(checkList.MachineCode) || string.IsNullOrEmpty(checkList.ICColor) || checkList.TECreatedBy == null)
                {
                    return Json(new { satatus = false, message = "Save Check List Failed. Please check input field." });
                }
                else
                {
                    AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
                    var checkListDao = new CheckListDao();
                    checkList.UpdatedBy = userLogin.UserId;
                    var check = checkListDao.SaveCheckListFirst(data.checkList, userLogin, data.mode);

                    var dataResult = checkListDao.GetVMCheckListById(check.CheckListFirstId);

                    if (check != null)
                    {
                        return Json(new { status = true, data = JsonConvert.SerializeObject(dataResult) });
                    }
                    else
                    {
                        return Json(new { status = false, message = "Save Check List Failed" });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = false, message = ex.Message });
            }
        }

        [HttpPost]
        public int DeleteCheckList(int checkListId)
        {
            var checkListDao = new CheckListDao();
            var check = checkListDao.DeleteCheckList(checkListId);
            if (check == 1)
            {
                return 1;// thành công
            }
            else
            {
                return 0;//thất bại (catch)
            }
        }
        #endregion

    }
}