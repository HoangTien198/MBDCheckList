using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Commons
{
    public class CheckListOnTimeAjaxLineLeader
    {
        public int CheckListFirstId { get; set; }
        public int TimeLineId { get; set; }
        public int PassQuantity { get; set; }
        public int FailQuantity { get; set; }
        public string ReasonAndSolution { get; set; }
        public int LineLeaderTestQuantity { get; set; }
        public string MailSelected { get; set; }
    }
}