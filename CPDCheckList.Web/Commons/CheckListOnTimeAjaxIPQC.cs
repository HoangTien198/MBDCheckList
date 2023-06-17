using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Commons
{
    public class CheckListOnTimeAjaxIPQC
    {
        public int CheckListOnTimeId { get; set; }
        public int IPQCTestQuantity { get; set; }
        public byte ICStatus { get; set; }
        public byte PinNG { get; set; }
        public string ReasonAndSolution { get; set; }
    }
}