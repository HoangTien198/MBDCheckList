using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Commons
{
    public class CheckListAjax
    {
        public int CheckListFirstId { get; set; }
        public string MO { get; set; }

        public string ChecklistCreateDate { get; set; }

        public string ShiftWork { get; set; }

        public string ModelName { get; set; }

        public string ProgramName { get; set; }

        public string SoftwareName { get; set; }

        public string Checksum { get; set; }

        public string MaterialCode { get; set; }

        public string MaterialCodeProducer { get; set; }

        public string MachineCode { get; set; }

        public string ICColor { get; set; }

        public string PersonalColor { get; set; }

        public string CheckESD { get; set; }

        public int? TECreatedBy { get; set; }

        public string TestQuantityFirst { get; set; }

        public byte? LineLeaderConfirm { get; set; }

        public int? LineLeaderConfirmBy { get; set; }

        public DateTime? LineLeaderConfirmDate { get; set; }

        public byte? IPQCConfirm { get; set; }

        public int? IPQCConfirmBy { get; set; }

        public DateTime? IPQCConfirmDate { get; set; }

        public byte? StatusConfirm { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public string Location { get; set; }
    }
}