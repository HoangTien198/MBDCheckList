using CPDCheckList.Web.Commons;
using CPDCheckList.Web.Models.EF;
using CPDCheckList.Web.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Models.DAO
{
    public class CheckListOnTimeDao
    {
        private CheckListDbContext db = null;
        public CheckListOnTimeDao()
        {
            db = new CheckListDbContext();
        }

        /// <summary>
        /// Hàm lấy list VM_CheckListOnTime theo CheckListFirstId
        /// </summary>
        /// <param name="checkListFirstId"></param>
        /// <returns>List<VM_CheckListOnTime></returns>
        public List<VM_CheckListOnTime> GetAllByCheckListId(int checkListFirstId)
        {
            var lstCheckListOnTimeVM = db.CheckListOnTimes.Where(c => c.CheckListFirstId == checkListFirstId).OrderBy(c => c.TimeLineId);
            var result = lstCheckListOnTimeVM.Select(c => new VM_CheckListOnTime
            {
                CheckListOnTimeId = c.CheckListOnTimeId,
                PassQuantity = c.PassQuantity,
                FailQuantity = c.FailQuantity,
                ReasonAndSolution = c.ReasonAndSolution,
                LineLeaderTestQuantity = c.LineLeaderTestQuantity,
                LineLeaderConfirmBy = c.LineLeaderConfirmBy,
                IPQCTestQuantity = c.IPQCTestQuantity,
                IPQCConfirmBy = c.IPQCConfirmBy,
                StatusCheckListOnTime=c.StatusCheckListOnTime,
                ICStatus = c.ICStatus,
                PinNG = c.PinNG,
                Other = c.Other,
                TimeLineId = c.TimeLineId,
                CheckListFirstId = c.CheckListFirstId,
                CreatedDate = c.CreatedDate,
                CreatedBy = c.CreatedBy,
                UpdatedDate = c.UpdatedDate,
                UpdatedBy = c.UpdatedBy
            }).ToList();
            return result;
        }

        /// <summary>
        /// Hàm Line Leader xác nhận check list Ontime:
        /// </summary>
        /// <param name="data"></param>
        /// <param name="userLogin"></param>
        /// <returns>1; Thành công | 0:Thất bại</returns>
        public string LineLeaderConfirmCheckListOnTime(CheckListOnTimeAjaxLineLeader data, AccountLogin userLogin)
        {
            try
            {
                var newClOnTime = new CheckListOnTime();
                newClOnTime.CheckListFirstId = data.CheckListFirstId;
                newClOnTime.PassQuantity = data.PassQuantity;
                newClOnTime.FailQuantity = data.FailQuantity;
                newClOnTime.ReasonAndSolution = data.ReasonAndSolution;
                newClOnTime.LineLeaderTestQuantity = data.LineLeaderTestQuantity;
                newClOnTime.LineLeaderConfirmBy = userLogin.UserId;
                newClOnTime.TimeLineId = data.TimeLineId;
                newClOnTime.CreatedDate = DateTime.Now;
                newClOnTime.CreatedBy = userLogin.UserId;
                newClOnTime.CreatedDate = DateTime.Now;
                newClOnTime.StatusCheckListOnTime = 1;//Chờ IPQC xác nhận
                db.CheckListOnTimes.Add(newClOnTime);
                db.SaveChanges();

                // Gửi mail xác nhận cho IPQC:
                var userDao = new UserDao();
                var user = userDao.GetById((int)userLogin.UserId);
                var clDao = new CheckListDao();
                var _checkList = clDao.GetVMCheckListById(data.CheckListFirstId);
                var timeLineDao = new TimeLineDao();
                var _timeLine = timeLineDao.GetById(data.TimeLineId);

                //if (data.MailSelected.Trim().ToUpper() == "ARLO")
                //{
                //    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();
                //    string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_IPQC_ARLO, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Period of time check list",
                //        $"Period of time check list is created by:{user.UserCode} - {user.UserFullName}. Please Confirm Period of time check list on Special Data Management system: http://10.220.130.116:8888 \nMO: {_checkList.MO}\nDate: {_checkList.CreatedDate}\nShift Work: {(_checkList.ShiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\nTime: {_timeLine.WorkOn}\n-----------------", "");
                //}
                //if (data.MailSelected.Trim().ToUpper() == "NETGEAR")
                //{
                //    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();
                //    string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_IPQC_NETGEAR, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Period of time check list",
                //        $"Period of time check list is created by:{user.UserCode} - {user.UserFullName}. Please Confirm Period of time check list on Special Data Management system: http://10.220.130.116:8888 \nMO: {_checkList.MO}\nDate: {_checkList.CreatedDate}\nShift Work: {(_checkList.ShiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\nTime: {_timeLine.WorkOn}\n-----------------", "");
                //}
                //if (data.MailSelected.Trim().ToUpper() == "F17_IPQC")
                //{
                //    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();
                //    string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_IPQC_F17, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Period of time check list",
                //        $"Period of time check list is created by:{user.UserCode} - {user.UserFullName}. Please Confirm Period of time check list on Special Data Management system: http://10.220.130.116:8888 \nMO: {_checkList.MO}\nDate: {_checkList.CreatedDate}\nShift Work: {(_checkList.ShiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\nTime: {_timeLine.WorkOn}\n-----------------", "");
                //}
                return string.Empty;//thành công
            }
            catch (Exception ex)
            {

                return ex.Message;//thất bại
            }
            
        }

        public int IPQCConfirmCheckListOnTime(CheckListOnTimeAjaxIPQC data, AccountLogin userLogin)
        {
            try
            {
                var _cLOntime = db.CheckListOnTimes.FirstOrDefault(c => c.CheckListOnTimeId == data.CheckListOnTimeId);

                _cLOntime.ReasonAndSolution = data.ReasonAndSolution;
                _cLOntime.ICStatus = data.ICStatus;
                _cLOntime.PinNG = data.PinNG;
                _cLOntime.IPQCTestQuantity = data.IPQCTestQuantity;
                _cLOntime.IPQCConfirmBy = userLogin.UserId;
                _cLOntime.StatusCheckListOnTime = 2;//IPQC OK
                db.SaveChanges();
                return 1;//thành công
            }
            catch (Exception)
            {

                return 0;//thất bại
            }
        }
    }
}