//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CPDCheckList.Web.Areas.Lable.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class LableDataFlow
    {
        public int Id { get; set; }
        public Nullable<System.DateTime> DateTime { get; set; }
        public string Shift { get; set; }
        public string MO { get; set; }
        public string ProductName { get; set; }
        public Nullable<int> MO_Num { get; set; }
        public string LableCode { get; set; }
        public string LableTable { get; set; }
        public string BeginCode { get; set; }
        public string EndCode { get; set; }
        public Nullable<int> LablePrintNum { get; set; }
        public Nullable<int> MOPrintNum { get; set; }
        public Nullable<int> IdStatus { get; set; }
        public string Location { get; set; }
        public string BeginCodeImage { get; set; }
        public string EndCodeImage { get; set; }
        public string Note { get; set; }
    
        public virtual LableDataFlow_Status LableDataFlow_Status { get; set; }
    }
}
