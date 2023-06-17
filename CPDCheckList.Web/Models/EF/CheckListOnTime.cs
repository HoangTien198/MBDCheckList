namespace CPDCheckList.Web.Models.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class CheckListOnTime
    {
        public int CheckListOnTimeId { get; set; }

        public int? PassQuantity { get; set; }

        public int? FailQuantity { get; set; }

        [Column(TypeName = "ntext")]
        public string ReasonAndSolution { get; set; }

        public int? LineLeaderTestQuantity { get; set; }

        public int? LineLeaderConfirmBy { get; set; }

        public int? IPQCTestQuantity { get; set; }

        public int? IPQCConfirmBy { get; set; }

        public byte? StatusCheckListOnTime { get; set; }

        public byte? ProgramPassOrFail { get; set; }

        public byte? ICStatus { get; set; }

        public byte? PinNG { get; set; }

        [StringLength(255)]
        public string Other { get; set; }

        public int? TimeLineId { get; set; }

        public int? CheckListFirstId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public virtual CheckListFirst CheckListFirst { get; set; }

        public virtual TimeLine TimeLine { get; set; }
    }
}
