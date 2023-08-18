using CPDCheckList.Web.Commons;
using CPDCheckList.Web.Models.EF;
using CPDCheckList.Web.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Models.DAO
{
    public class CheckListDao
    {
        private CheckListDbContext db = null;
        public CheckListDao()
        {
            db = new CheckListDbContext();
        }

        #region Data-Common
        /// <summary>
        /// Hàm lấy tất cả bản ghi check list (View Model)
        /// </summary>
        /// <returns>List<VM_CheckListFirst></returns>
        public List<VM_CheckListFirst> GetAllVMCheckList(string location, int year, int month, int day)
        {           
            DateTime startDate;
            if (day < 3 && day != -1)
            {
                startDate = new DateTime(year, month - 1, 1);

            }
            else
            {
                startDate = new DateTime(year, month, 1);
            }
            DateTime endDateTemp = new DateTime(year, month, DateTime.DaysInMonth(year, month));
            DateTime endDate = new DateTime(year, month, DateTime.DaysInMonth(year, month));

            if (day == endDate.Day)
            {
                endDate = endDateTemp.AddMonths(1);
            }

            var result = db.CheckListFirsts.Where(c=>c.Location == location && (c.CreatedDate >= startDate && c.CreatedDate <= endDate)).Select(c => new VM_CheckListFirst
            {
                CheckListFirstId = c.CheckListFirstId,
                MO = c.MO,
                ChecklistCreateDate = c.ChecklistCreateDate,
                ShiftWork = c.ShiftWork,
                ModelName = c.ModelName,
                ProgramName = c.ProgramName,
                SoftwareName = c.SoftwareName,
                Checksum = c.Checksum,
                MaterialCode = c.MaterialCode,
                MaterialCodeProducer = c.MaterialCodeProducer,
                MachineCode = c.MachineCode,
                ICColor = c.ICColor,
                PersonalColor = c.PersonalColor,
                CheckESD = c.CheckESD,
                TECreatedBy = c.TECreatedBy,
                //TestQuantityFirst = c.TestQuantityFirst,
                LineLeaderConfirm = c.LineLeaderConfirm,
                LineLeaderConfirmBy = c.LineLeaderConfirmBy,
                LineLeaderConfirmDate = c.LineLeaderConfirmDate,
                LineLeaderRejectBy = c.LineLeaderRejectBy,
                LineLeaderRejectDate=c.LineLeaderRejectDate,
                LineLeaderReasonReject = c.LineLeaderReasonReject,
                IPQCConfirm = c.IPQCConfirm,
                IPQCConfirmBy = c.IPQCConfirmBy,
                IPQCConfirmDate = c.IPQCConfirmDate,
                IPQCRejectBy = c.IPQCRejectBy,
                IPQCRejectDate=c.IPQCRejectDate,
                IPQCReasonReject = c.IPQCReasonReject,
                StatusConfirm = c.StatusConfirm,
                CreatedDate = c.CreatedDate,
                CreatedBy = c.CreatedBy,
                UpdatedDate = c.UpdatedDate,
                UpdatedBy = c.UpdatedBy
            }).OrderByDescending(c => c.CreatedDate).ThenByDescending(c => c.UpdatedDate).ToList();
            return result;
        }

        public VM_CheckListFirst GetVMCheckListById(int id)
        {
            var c = db.CheckListFirsts.FirstOrDefault(cl => cl.CheckListFirstId == id);

            //gán data:
            var result = new VM_CheckListFirst();

            result.CheckListFirstId = c.CheckListFirstId;
            result.MO = c.MO;
            result.ChecklistCreateDate = c.ChecklistCreateDate;
            result.ShiftWork = c.ShiftWork;
            result.ModelName = c.ModelName;
            result.ProgramName = c.ProgramName;
            result.SoftwareName = c.SoftwareName;
            result.Checksum = c.Checksum;
            result.MaterialCode = c.MaterialCode;
            result.MaterialCodeProducer = c.MaterialCodeProducer;
            result.MachineCode = c.MachineCode;
            result.ICColor = c.ICColor;
            result.PersonalColor = c.PersonalColor;
            result.CheckESD = c.CheckESD;
            result.TECreatedBy = c.TECreatedBy;
            //result.TestQuantityFirst = c.TestQuantityFirst;
            result.LineLeaderConfirm = c.LineLeaderConfirm;
            result.LineLeaderConfirmBy = c.LineLeaderConfirmBy;
            result.LineLeaderConfirmDate = c.LineLeaderConfirmDate;
            result.LineLeaderRejectBy = c.LineLeaderRejectBy;
            result.LineLeaderRejectDate = c.LineLeaderRejectDate;
            result.LineLeaderReasonReject = c.LineLeaderReasonReject;
            result.IPQCConfirm = c.IPQCConfirm;
            result.IPQCConfirmBy = c.IPQCConfirmBy;
            result.IPQCConfirmDate = c.IPQCConfirmDate;
            result.IPQCRejectBy = c.IPQCRejectBy;
            result.IPQCRejectDate = c.IPQCRejectDate;
            result.IPQCReasonReject = c.IPQCReasonReject;
            result.StatusConfirm = c.StatusConfirm;
            result.CreatedDate = c.CreatedDate;
            result.CreatedBy = c.CreatedBy;
            result.UpdatedDate = c.UpdatedDate;
            result.UpdatedBy = c.UpdatedBy;
            return result;
        }
        #endregion


        #region TE
        /// <summary>
        /// Hàm lưu 1 bảng kiểm tra đầu tiên
        /// </summary>
        /// <param name="checkList">CheckListAjax -> folder: Common</param>
        /// <param name="userLogin">Người đang đăng nhập</param>
        /// <returns>1: thành công | 0: thất bại</returns>
        public CheckListFirst SaveCheckListFirst(CheckListAjax checkList, AccountLogin userLogin, string mode)
        {
            try
            {
                CheckListFirst result = new CheckListFirst();
                if (mode == "add")
                {
                    //validate:
                    var _shiftWork = Byte.Parse(checkList.ShiftWork);
                    var _checkESD = Byte.Parse(checkList.CheckESD);
                    //var _testQuantityFirst = Byte.Parse(checkList.TestQuantityFirst);
                    var dateTeCreated = DateTime.Parse(checkList.ChecklistCreateDate);

                    //gán data:
                    var newCheckList = new CheckListFirst();
                    newCheckList.MO = checkList.MO;
                    newCheckList.ChecklistCreateDate = dateTeCreated;
                    newCheckList.ShiftWork = _shiftWork;
                    newCheckList.ModelName = checkList.ModelName;
                    newCheckList.ProgramName = checkList.ProgramName;
                    newCheckList.SoftwareName = checkList.SoftwareName;
                    newCheckList.Checksum = checkList.Checksum;
                    newCheckList.MaterialCode = checkList.MaterialCode;
                    newCheckList.MaterialCodeProducer = checkList.MaterialCodeProducer;
                    newCheckList.MachineCode = checkList.MachineCode;
                    newCheckList.ICColor = checkList.ICColor;
                    newCheckList.PersonalColor = checkList.PersonalColor;
                    newCheckList.CheckESD = _checkESD;
                    newCheckList.TECreatedBy = checkList.TECreatedBy;
                    //newCheckList.TestQuantityFirst = _testQuantityFirst;
                    newCheckList.LineLeaderConfirm = 2;//chuyền trưởng chưa kiểm tra
                    newCheckList.IPQCConfirm = 2;//IPQC chưa kiểm tra
                    newCheckList.StatusConfirm = 0;// Chờ chuyền trưởng xác nhận
                    newCheckList.CreatedDate = DateTime.Now;
                    newCheckList.CreatedBy = userLogin.UserId;
                    newCheckList.Location = checkList.Location.Trim();

                    //gán db:
                    db.CheckListFirsts.Add(newCheckList);

                    result = newCheckList;
                    db.SaveChanges();

                    //gửi mail
                    var userDao = new UserDao();
                    var user = userDao.GetById((int)checkList.TECreatedBy);
                    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();
                    if (checkList.Location.Trim().ToUpper() == "F06")
                    {
                        string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_LABEL, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Copy IC First Article Inspection List",
                        $"Please Confirm check list Check List system: http://10.220.130.116:8888 \nMO: {checkList.MO}\nDate: {dateTeCreated}\nShift Work: {(_shiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserFullName}\n-----------------", "");
                    }
                    if (checkList.Location.Trim().ToUpper() == "F17")
                    {
                        string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_KITTING_F17, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Copy IC First Article Inspection List",
                        $"Please Confirm check list Check List system: http://10.220.130.116:8888 \nMO: {checkList.MO}\nDate: {dateTeCreated}\nShift Work: {(_shiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserFullName}\n-----------------", "");
                    }

                }
                if (mode == "edit")
                {
                    //Lấy check list:
                    var _checkList = db.CheckListFirsts.FirstOrDefault(cl => cl.CheckListFirstId == checkList.CheckListFirstId);

                    //validate:
                    var _shiftWork = Byte.Parse(checkList.ShiftWork);
                    var _checkESD = Byte.Parse(checkList.CheckESD);
                    //var _testQuantityFirst = Byte.Parse(checkList.TestQuantityFirst);
                    var dateTeCreated = DateTime.Parse(checkList.ChecklistCreateDate);

                    //gán data:
                    _checkList.MO = checkList.MO;
                    _checkList.ChecklistCreateDate = dateTeCreated;
                    _checkList.ShiftWork = _shiftWork;
                    _checkList.ModelName = checkList.ModelName;
                    _checkList.ProgramName = checkList.ProgramName;
                    _checkList.SoftwareName = checkList.SoftwareName;
                    _checkList.Checksum = checkList.Checksum;
                    _checkList.MaterialCode = checkList.MaterialCode;
                    _checkList.MaterialCodeProducer = checkList.MaterialCodeProducer;
                    _checkList.MachineCode = checkList.MachineCode;
                    _checkList.ICColor = checkList.ICColor;
                    _checkList.PersonalColor = checkList.PersonalColor;
                    _checkList.CheckESD = _checkESD;
                    _checkList.TECreatedBy = checkList.TECreatedBy;
                    //_checkList.TestQuantityFirst = _testQuantityFirst;
                    _checkList.LineLeaderConfirm = 2;//chuyền trưởng chưa kiểm tra
                    _checkList.IPQCConfirm = 2;//IPQC chưa kiểm tra
                    _checkList.StatusConfirm = 0;// Chờ chuyền trưởng xác nhận
                    _checkList.UpdatedDate = DateTime.Now;
                    _checkList.UpdatedBy = userLogin.UserId;
                    db.SaveChanges();

                    result = _checkList;

                    //gửi mail
                    var userDao = new UserDao();
                    var user = userDao.GetById((int)checkList.UpdatedBy);
                    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();

                    if (checkList.Location.Trim().ToUpper() == "F06")
                    {
                        string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_LABEL, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Copy IC First Article Inspection List",
                        $"Check list is updated by:{user.UserCode} - {user.UserFullName}. Please Confirm check list on Check List system: http://10.220.130.116:8888 \nMO: {checkList.MO}\nDate: {dateTeCreated}\nShift Work: {(_shiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\n-----------------", "");
                    }
                    if (checkList.Location.Trim().ToUpper() == "F17")
                    {
                        string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_KITTING_F17, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Copy IC First Article Inspection List",
                        $"Check list is updated by:{user.UserCode} - {user.UserFullName}. Please Confirm check list on Check List system: http://10.220.130.116:8888 \nMO: {checkList.MO}\nDate: {dateTeCreated}\nShift Work: {(_shiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\n-----------------", "");
                    }
                    
                }

                
                return result;//thành công, chờ chuyền trưởng và IPQC xác nhận
            }
            catch (Exception)
            {
                return null;// thất bại
            }

        }

        /// <summary>
        /// Hàm xóa 1 check list
        /// </summary>
        /// <param name="checkListId"></param>
        /// <returns>1: Thành công | 0: Thất bại (catch)</returns>
        public int DeleteCheckList(int checkListId)
        {
            try
            {
                var _checkList = db.CheckListFirsts.FirstOrDefault(cl => cl.CheckListFirstId == checkListId);
                var listOntime = db.CheckListOnTimes.Where(clo => clo.CheckListFirstId == checkListId);
                //db.CheckListOnTimes.RemoveRange(listOntime);
                //db.CheckListFirsts.Remove(_checkList);
                //db.SaveChanges();
                return 1;
            }
            catch (Exception)
            {
                return 0;
            }

        }
        #endregion


        #region Line Leader
        /// <summary>
        /// Hàm xác nhận sau khi line leader bấm Confirm
        /// </summary>
        /// <param name="checkListid"></param>
        /// <param name="userLogin"></param>
        /// <returns>1: thành công | 0: thất bại</returns>
        public int ConfirmCheckList(int checkListId, AccountLogin userLogin, string mailSelected)
        {
            try
            {
                var _checkList = db.CheckListFirsts.FirstOrDefault(cl => cl.CheckListFirstId == checkListId);
                _checkList.LineLeaderConfirm = 1;//Chuyền trưởng OK
                _checkList.LineLeaderConfirmDate = DateTime.Now;
                _checkList.LineLeaderConfirmBy = userLogin.UserId;
                _checkList.StatusConfirm = 1;//Chuyền trưởng OK => Chờ IPQC xác nhận
                db.SaveChanges();

                //gửi mail
                var userDao = new UserDao();
                var user = userDao.GetById((int)_checkList.TECreatedBy);
                if (mailSelected.Trim().ToUpper() == "ARLO")
                {
                    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();
                    string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_IPQC_ARLO, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Copy IC First Article Inspection List",
                        $"Check list is created by:{user.UserCode} - {user.UserFullName}. Please Confirm check list on Check List system: http://10.220.130.116:8888 \nMO: {_checkList.MO}\nDate: {_checkList.CreatedDate}\nShift Work: {(_checkList.ShiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\n-----------------", "");
                }
                if (mailSelected.Trim().ToUpper() == "NETGEAR")
                {
                    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();
                    string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_IPQC_NETGEAR, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Copy IC First Article Inspection List",
                        $"Check list is created by:{user.UserCode} - {user.UserFullName}. Please Confirm check list on Check List system: http://10.220.130.116:8888 \nMO: {_checkList.MO}\nDate: {_checkList.CreatedDate}\nShift Work: {(_checkList.ShiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\n-----------------", "");
                }
                if (mailSelected.Trim().ToUpper() == "F17_IPQC")
                {
                    SFCService.Servicepostdata sfcmail = new SFCService.Servicepostdata();
                    string rs = sfcmail.SEND_MAIL_PARAM(ListMail.MAIL_IPQC_F17, "cpeii-vn-te-me@mail.foxconn.com", "", "Confirm Copy IC First Article Inspection List",
                        $"Check list is created by:{user.UserCode} - {user.UserFullName}. Please Confirm check list on Check List system: http://10.220.130.116:8888 \nMO: {_checkList.MO}\nDate: {_checkList.CreatedDate}\nShift Work: {(_checkList.ShiftWork == 1 ? "Ngay" : "Dem")}\nCreated By: {user.UserCode} - {user.UserFullName}\n-----------------", "");
                }
                return 1;//thành công
            }
            catch (Exception)
            {

                return 0;//thất bại
            }

        }

        /// <summary>
        /// Hàm reject sau khi line leader bấm reject
        /// </summary>
        /// <param name="checkListId"></param>
        /// <param name="lineLeaderReasonReject"></param>
        /// <param name="userLogin"></param>
        /// <returns>1: Thành công | 0: thất bại</returns>
        public int RejectCheckList(int checkListId, string lineLeaderReasonReject, AccountLogin userLogin)
        {
            try
            {
                var _checkList = db.CheckListFirsts.FirstOrDefault(cl => cl.CheckListFirstId == checkListId);

                _checkList.LineLeaderRejectBy = userLogin.UserId;//Id của Chuyền trưởng reject
                _checkList.LineLeaderRejectDate = DateTime.Now;
                _checkList.LineLeaderReasonReject = lineLeaderReasonReject;
                _checkList.StatusConfirm = 3;//chuyền trưởng reject
                db.SaveChanges();
                return 1;//thành công
            }
            catch (Exception)
            {
                return 0;//thất bại
            }
        }
        #endregion

        #region IPQC
        /// <summary>
        /// Hàm xác nhận sau khi line leader bấm Confirm
        /// </summary>
        /// <param name="checkListid"></param>
        /// <param name="userLogin"></param>
        /// <returns>1: thành công | 0: thất bại</returns>
        public int IPQCConfirmCheckList(int checkListId, AccountLogin userLogin)
        {
            try
            {
                var _checkList = db.CheckListFirsts.FirstOrDefault(cl => cl.CheckListFirstId == checkListId);
                _checkList.IPQCConfirm = 1;//IPQC OK
                _checkList.IPQCConfirmDate = DateTime.Now;
                _checkList.IPQCConfirmBy = userLogin.UserId;
                _checkList.StatusConfirm = 2;//IPQC OK
                db.SaveChanges();
                return 1;//thành công
            }
            catch (Exception)
            {
                return 0;//thất bại
            }

        }

        /// <summary>
        /// Hàm reject sau khi line leader bấm reject
        /// </summary>
        /// <param name="checkListId"></param>
        /// <param name="lineLeaderReasonReject"></param>
        /// <param name="userLogin"></param>
        /// <returns>1: Thành công | 0: thất bại</returns>
        public int IPQCRejectCheckList(int checkListId, string iPQCReasonReject, AccountLogin userLogin)
        {
            try
            {
                var _checkList = db.CheckListFirsts.FirstOrDefault(cl => cl.CheckListFirstId == checkListId);

                _checkList.IPQCRejectBy = userLogin.UserId;//Id của IPQC reject
                _checkList.IPQCRejectDate = DateTime.Now;
                _checkList.IPQCReasonReject = iPQCReasonReject;
                _checkList.StatusConfirm = 4;//IPQC reject
                db.SaveChanges();
                return 1;//thành công
            }
            catch (Exception)
            {
                return 0;//thất bại
            }
        }
        #endregion
    }
}