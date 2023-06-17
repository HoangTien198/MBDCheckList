using CPDCheckList.Web.Commons;
using CPDCheckList.Web.Models.DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CPDCheckList.Web.Areas.BanDau;
using Newtonsoft.Json;

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
            return View();
        }
        public ActionResult F17()
        {
            return View();
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
        public int IPQCRejectCheckList(int checkListId, string iPQCReasonReject)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var checkListDao = new CheckListDao();
            var check = checkListDao.IPQCRejectCheckList(checkListId, iPQCReasonReject, userLogin);
            if (check == 1)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
        [HttpPost]
        public int ConfirmCheckListOnTimeIPQC(CheckListOnTimeAjaxIPQC data)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var clOnTimeDao = new CheckListOnTimeDao();
            var check = clOnTimeDao.IPQCConfirmCheckListOnTime(data, userLogin);
            if (check == 1)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
        #endregion



        #region Line Leader
        [HttpPost]
        public int ConfirmCheckList(int checkListId, string mailSelected)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var checkListDao = new CheckListDao();
            var check = checkListDao.ConfirmCheckList(checkListId, userLogin, mailSelected);
            if (check == 1)
            {
                return 1;//thành công
            }
            else
            {
                return 0;//thất bại

            }
        }

        [HttpPost]
        public int RejectCheckList(int checkListId, string lineLeaderReasonReject)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var checkListDao = new CheckListDao();
            var check = checkListDao.RejectCheckList(checkListId, lineLeaderReasonReject, userLogin);
            if (check == 1)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }


        [HttpPost]
        public int ConfirmCheckListOnTimeLineLeader(CheckListOnTimeAjaxLineLeader data)
        {
            AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
            var clOnTimeDao = new CheckListOnTimeDao();
            var check = clOnTimeDao.LineLeaderConfirmCheckListOnTime(data, userLogin);
            if (check == 1)
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
        #endregion

        #region Worker
        [HttpPost]
        public int SaveCheckListFirst(CheckListSaveAjax data)
        {
            try
            {
                var checkList = data.checkList;
                
                if (string.IsNullOrEmpty(checkList.MO) || string.IsNullOrEmpty(checkList.ChecklistCreateDate) || string.IsNullOrEmpty(checkList.ShiftWork) || string.IsNullOrEmpty(checkList.ModelName) || string.IsNullOrEmpty(checkList.ProgramName) || string.IsNullOrEmpty(checkList.Checksum) || string.IsNullOrEmpty(checkList.MaterialCode) || string.IsNullOrEmpty(checkList.MaterialCodeProducer) || string.IsNullOrEmpty(checkList.MachineCode) || string.IsNullOrEmpty(checkList.ICColor) || checkList.TECreatedBy == null)
                {
                    return -1;//Sai dữ liệu đầu vào
                }
                else
                {
                    AccountLogin userLogin = (AccountLogin)Session["USER_SESSION"];
                    var checkListDao = new CheckListDao();
                    checkList.UpdatedBy = userLogin.UserId;
                    int check = checkListDao.SaveCheckListFirst(data.checkList, userLogin, data.mode);
                    if (check == 1)
                    {
                        return 1;//thành công
                    }
                    else
                    {
                        return 0;//thất bại
                    }
                }
            }
            catch (Exception)
            {
                return -2;//Server error
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