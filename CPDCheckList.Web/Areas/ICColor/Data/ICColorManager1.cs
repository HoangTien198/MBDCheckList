//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CPDCheckList.Web.Areas.ICColor.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class ICColorManager1
    {
        public int Id { get; set; }
        public string Customer { get; set; }
        public string ProgramName { get; set; }
        public string MachineName { get; set; }
        public string MachineType { get; set; }
        public string ICCode { get; set; }
        public string ICParameter { get; set; }
        public string Checksum { get; set; }
        public string SocketBoard { get; set; }
        public Nullable<int> Improver { get; set; }
        public string Step { get; set; }
        public Nullable<int> Time { get; set; }
        public Nullable<bool> IsCheck { get; set; }
        public Nullable<System.DateTime> ChangeDate { get; set; }
        public Nullable<int> IdStatus { get; set; }
    
        public virtual ICColorStatus Status { get; set; }
    }
}
