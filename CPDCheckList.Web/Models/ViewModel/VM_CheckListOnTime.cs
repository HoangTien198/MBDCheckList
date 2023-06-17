using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using CPDCheckList.Web.Models.DAO;

namespace CPDCheckList.Web.Models.ViewModel
{
    public class VM_CheckListOnTime
    {
        public int CheckListOnTimeId { get; set; }

        public int? PassQuantity { get; set; }

        public int? FailQuantity { get; set; }

        public string ReasonAndSolution { get; set; }

        public int? LineLeaderTestQuantity { get; set; }

        public int? LineLeaderConfirmBy { get; set; }

        public int? IPQCTestQuantity { get; set; }

        public int? IPQCConfirmBy { get; set; }
        public byte? StatusCheckListOnTime { get; set; }
        public byte? ICStatus { get; set; }
        public byte? PinNG { get; set; }

        public string Other { get; set; }

        public int? TimeLineId { get; set; }

        public int? CheckListFirstId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        //Thêm
        public string Checksum
        {
            get
            {
                var clDao = new CheckListDao();
                string checksum = "";
                if (CheckListFirstId != null)
                {
                    checksum = clDao.GetVMCheckListById((int)CheckListFirstId).Checksum;
                }
                else
                {
                    checksum = "";
                }
                return checksum;
            }
        }
        public string LineLeaderConfirmByName
        {
            get
            {
                var userDao = new UserDao();
                string lineLeaderConfirmByName = "";
                if (LineLeaderConfirmBy != null)
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
        public string WorkOn
        {
            get
            {
                var timeLineDao = new TimeLineDao();
                string workOn = "";
                if (TimeLineId!= null)
                {
                    workOn = timeLineDao.GetById((int)TimeLineId).WorkOn;
                }
                else
                {
                    workOn = "";
                }
                return workOn;
            }
        }

    }
}