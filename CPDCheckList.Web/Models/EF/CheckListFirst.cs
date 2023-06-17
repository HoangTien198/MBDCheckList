namespace CPDCheckList.Web.Models.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class CheckListFirst
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CheckListFirst()
        {
            CheckListOnTimes = new HashSet<CheckListOnTime>();
        }

        public int CheckListFirstId { get; set; }

        [StringLength(50)]
        public string MO { get; set; }

        public DateTime? ChecklistCreateDate { get; set; }

        public byte? ShiftWork { get; set; }

        [StringLength(60)]
        public string ModelName { get; set; }

        [StringLength(250)]
        public string ProgramName { get; set; }

        [StringLength(50)]
        public string SoftwareName { get; set; }

        [StringLength(60)]
        public string Checksum { get; set; }

        [StringLength(100)]
        public string MaterialCode { get; set; }

        [StringLength(100)]
        public string MaterialCodeProducer { get; set; }

        [StringLength(50)]
        public string MachineCode { get; set; }

        [StringLength(50)]
        public string ICColor { get; set; }

        [StringLength(50)]
        public string PersonalColor { get; set; }

        public byte? CheckESD { get; set; }

        public int? TECreatedBy { get; set; }

        public byte? TestQuantityFirst { get; set; }

        public byte? LineLeaderConfirm { get; set; }

        public int? LineLeaderConfirmBy { get; set; }

        public DateTime? LineLeaderConfirmDate { get; set; }

        [Column(TypeName = "ntext")]
        public string LineLeaderReasonReject { get; set; }

        public int? LineLeaderRejectBy { get; set; }

        public DateTime? LineLeaderRejectDate { get; set; }

        public byte? IPQCConfirm { get; set; }

        public int? IPQCConfirmBy { get; set; }

        public DateTime? IPQCConfirmDate { get; set; }

        [Column(TypeName = "ntext")]
        public string IPQCReasonReject { get; set; }

        public int? IPQCRejectBy { get; set; }

        public DateTime? IPQCRejectDate { get; set; }

        public byte? StatusConfirm { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        [StringLength(50)]
        public string Location { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CheckListOnTime> CheckListOnTimes { get; set; }
    }
}
