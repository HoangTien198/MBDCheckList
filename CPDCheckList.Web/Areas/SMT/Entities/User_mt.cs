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
    using System.Text.Json.Serialization;

    public partial class User_mt
    {
        public int UserId { get; set; }
        public string UserCode { get; set; }
        public string UserFullName { get; set; }
        public string Username { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<int> RoleId { get; set; }
    
        public virtual Role_mt Role { get; set; }
    }
}
