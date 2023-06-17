using CPDCheckList.Web.Models.DAO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Models.ViewModel
{
    public class VM_CheckListFirst
    {
        public int CheckListFirstId { get; set; }

        public string MO { get; set; }

        public DateTime? ChecklistCreateDate { get; set; }

        public byte? ShiftWork { get; set; }

        public string ModelName { get; set; }

        public string ProgramName { get; set; }

        public string SoftwareName { get; set; }

        public string Checksum { get; set; }

        public string MaterialCode { get; set; }

        public string MaterialCodeProducer { get; set; }

        public string MachineCode { get; set; }

        public string ICColor { get; set; }

        public string PersonalColor { get; set; }

        public byte? CheckESD { get; set; }

        public int? TECreatedBy { get; set; }

        //public byte? TestQuantityFirst { get; set; }

        public byte? LineLeaderConfirm { get; set; }

        public int? LineLeaderConfirmBy { get; set; }

        public DateTime? LineLeaderConfirmDate { get; set; }
        public string LineLeaderReasonReject { get; set; }
        public int? LineLeaderRejectBy { get; set; }
        public DateTime? LineLeaderRejectDate { get; set; }
        public byte? IPQCConfirm { get; set; }

        public int? IPQCConfirmBy { get; set; }

        public DateTime? IPQCConfirmDate { get; set; }
        public string IPQCReasonReject { get; set; }

        public int? IPQCRejectBy { get; set; }

        public DateTime? IPQCRejectDate { get; set; }
        public byte? StatusConfirm { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        //Thông tin Thêm
        public string TeCreatedByName
        {
            get {
                var userDao = new UserDao();
                var teCreatedByName = userDao.GetById((int)TECreatedBy).UserFullName;
                return teCreatedByName;
            }
        }
        public string LineLeaderConfirmByName
        {
            get
            {
                var userDao = new UserDao();
                string lineLeaderConfirmByName = "";
                if (LineLeaderConfirmBy!=null)
                {
                    lineLeaderConfirmByName = userDao.GetById((int)LineLeaderConfirmBy).UserFullName;
                }
                else
                {
                    lineLeaderConfirmByName = "";
                }
                return lineLeaderConfirmByName;
            }
        }
        public string LineLeaderRejectByName
        {
            get
            {
                var userDao = new UserDao();
                string lineLeaderRejectByName = "";
                if (LineLeaderRejectBy != null)
                {
                    lineLeaderRejectByName = userDao.GetById((int)LineLeaderRejectBy).UserFullName;
                }
                else
                {
                    lineLeaderRejectByName = "";
                }
                return lineLeaderRejectByName;
            }
        }
        public string IPQCConfirmByName
        {
            get
            {
                var userDao = new UserDao();
                string iPQCConfirmByName = "";
                if (IPQCConfirmBy != null)
                {
                    iPQCConfirmByName = userDao.GetById((int)IPQCConfirmBy).UserFullName;
                }
                else
                {
                    iPQCConfirmByName = "";
                }
                return iPQCConfirmByName;
            }
        }
        public string IPQCRejectByName
        {
            get
            {
                var userDao = new UserDao();
                string iPQCRejectByName = "";
                if (IPQCRejectBy != null)
                {
                    iPQCRejectByName = userDao.GetById((int)IPQCRejectBy).UserFullName;
                }
                else
                {
                    iPQCRejectByName = "";
                }
                return iPQCRejectByName;
            }
        }
    }
}