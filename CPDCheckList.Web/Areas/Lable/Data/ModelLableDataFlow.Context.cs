﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class LableDataFlowEntities : DbContext
    {
        public LableDataFlowEntities()
            : base("name=LableDataFlowEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<LableDataFlow_Data> LableDataFlow_Data { get; set; }
        public virtual DbSet<LableDataFlow_Status> LableDataFlow_Status { get; set; }
        public virtual DbSet<LableDataFlow> LableDataFlows { get; set; }
        public virtual DbSet<User_Lb> User_Lb { get; set; }
    }
}
