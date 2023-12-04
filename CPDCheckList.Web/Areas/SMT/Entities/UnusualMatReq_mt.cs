//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CPDCheckList.Web.Areas.SMT.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class UnusualMatReq_mt
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public UnusualMatReq_mt()
        {
            this.UnusualMatReqStatus = new HashSet<UnusualMatReqStatus_mt>();
        }
    
        public int Id { get; set; }
        public Nullable<System.DateTime> DateReq { get; set; }
        public string ModelName { get; set; }
        public string MO { get; set; }
        public string MatDesc { get; set; }
        public string Unit { get; set; }
        public Nullable<int> ActReqQty { get; set; }
        public Nullable<int> ExReqQty { get; set; }
        public Nullable<int> DemQty { get; set; }
        public Nullable<int> ActDelQty { get; set; }
        public Nullable<int> TotalLoss { get; set; }
        public Nullable<double> MatCost { get; set; }
        public Nullable<double> TotalLossCost { get; set; }
        public string DemReason { get; set; }
        public string Location { get; set; }
        public string MatCode { get; set; }
        public string FilePath { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UnusualMatReqStatus_mt> UnusualMatReqStatus { get; set; }
    }
}
