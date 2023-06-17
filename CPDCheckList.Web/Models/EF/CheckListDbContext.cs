using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace CPDCheckList.Web.Models.EF
{
    public partial class CheckListDbContext : DbContext
    {
        public CheckListDbContext()
            : base("name=CheckListDbContext")
        {
        }

        public virtual DbSet<CheckListFirst> CheckListFirsts { get; set; }
        public virtual DbSet<CheckListOnTime> CheckListOnTimes { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<TimeLine> TimeLines { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CheckListFirst>()
                .Property(e => e.MO)
                .IsUnicode(false);

            modelBuilder.Entity<CheckListFirst>()
                .Property(e => e.MaterialCode)
                .IsUnicode(false);

            modelBuilder.Entity<CheckListFirst>()
                .Property(e => e.MaterialCodeProducer)
                .IsUnicode(false);

            modelBuilder.Entity<CheckListFirst>()
                .Property(e => e.MachineCode)
                .IsUnicode(false);

            modelBuilder.Entity<CheckListFirst>()
                .Property(e => e.ICColor)
                .IsUnicode(false);

            modelBuilder.Entity<CheckListFirst>()
                .Property(e => e.PersonalColor)
                .IsUnicode(false);

            modelBuilder.Entity<TimeLine>()
                .Property(e => e.WorkOn)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.UserCode)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Username)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Password)
                .IsUnicode(false);
        }
    }
}
