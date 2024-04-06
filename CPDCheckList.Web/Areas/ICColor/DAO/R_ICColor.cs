using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using CPDCheckList.Web.Areas.ICColor.Data;
using CPDCheckList.Web.Commons;
using Microsoft.Ajax.Utilities;
using System.Runtime.InteropServices.ComTypes;
using CPDCheckList.Web.Areas.Lable.Data;
using System.Drawing;

namespace CPDCheckList.Web.Areas.ICColor.DAO
{
    internal class R_ICColor
    {
        private static readonly ICColorManager context = new ICColorManager();

        /* GET */
        public static object GetICColors()
        {
            var ICColors = context.ICColorManager1.ToList();

            foreach ( var c in ICColors )
            {
                var status = c.ICColorStatuss.FirstOrDefault();
                status.UserCreated = context.User_ICColor.FirstOrDefault(u => u.UserId == status.IdUserCreated);
               // status.USER = context.User_ICColor.FirstOrDefault(u => u.UserId == status.IdUserCreated);
                //status.UserCreated = context.User_ICColor.FirstOrDefault(u => u.UserId == status.IdUserCreated);
            }

            var ICColorsByCustomer = ICColors
            .GroupBy(ic => ic.Customer)
            .ToDictionary(
                group => group.Key,
                group => group.ToList()
            );

            return ICColorsByCustomer;
        }
        public static ICColorManager1 GetICColor(int Id)
        {
            var ICColor = context.ICColorManager1.FirstOrDefault(ic => ic.Id == Id);

            ICColor.ICColorStatuss.FirstOrDefault().UserCreated = context.User_ICColor.FirstOrDefault(u => u.UserId == ICColor.Improver);

            return ICColor;
        }

        public static object GetUsers()
        {
            try
            {

                return context.User_ICColor.Select(u => new
                {
                    Id = u.UserId,
                    Username = u.Username,
                    VnName = u.UserFullName,
                }).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static object GetUser(int Id)
        {
            try
            {
                return context.User_ICColor.Select(u => new User_ICColor
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    UserFullName = u.UserFullName,
                }).FirstOrDefault(u => u.UserId == Id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        /* SET */
        public static Data.ICColorManager1 CreateICColor(ICColorManager1 icColor)
        {
            try
            {
                Random random = new Random();
                int randomMinutes = random.Next(10, 31);
                DateTime currentDateTime = DateTime.Now;
                DateTime newDateTime = currentDateTime.AddMinutes(randomMinutes);

                if (string.IsNullOrEmpty(icColor.Customer)) throw new Exception("Please create new Customer before create new record.");

                icColor.CreatedDate = currentDateTime;
                context.ICColorManager1.Add(icColor);
                context.SaveChanges();

                Data.ICColorStatus icColorStatus = new ICColorStatus
                {
                    IdICColor = icColor.Id,
                    IdUser1 = 119,
                    IdUser2 = 179,
                    Status = "Confirmed",
                    Datetime = newDateTime,
                    IdUserCreated = icColor.Improver
                };

                context.ICColorStatus1.Add(icColorStatus);
                context.SaveChanges();

                return GetICColor(icColor.Id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
           
        }
        public static ICColorManager1 UpdateICColor(ICColorManager1 icColor)
        {
            if (icColor == null)
            {
                throw new Exception("Data is null.");
            }

            var dbICColor = GetICColor(icColor.Id);

            if (dbICColor == null)
            {
                throw new Exception("IC Color does not exixts.");
            }

            dbICColor.Customer = icColor.Customer;
            dbICColor.ProgramName = icColor.ProgramName;
            dbICColor.MachineType = icColor.MachineType;
            dbICColor.ICCode = icColor.ICCode;
            dbICColor.ICParameter = icColor.ICParameter;
            dbICColor.Checksum = icColor.Checksum;
            dbICColor.SocketBoard = icColor.SocketBoard;
            dbICColor.Improver = icColor.Improver;
            dbICColor.Step = icColor.Step;
            dbICColor.Time = icColor.Time;
            dbICColor.ChangeDate = icColor.ChangeDate;
            dbICColor.ICColorStatuss.FirstOrDefault().IdUserCreated = icColor.Improver;

            context.SaveChanges();

            return GetICColor(icColor.Id);
        }
        public static bool DeleteICColor(int Id)
        {

            AccountLogin userLogin = (AccountLogin)HttpContext.Current.Session["USER_SESSION"];
            if (userLogin.UserId == 119 || userLogin.UserId == 179)
            {
                var dbICColor = GetICColor(Id);

                if (dbICColor == null)
                {
                    throw new Exception("IC Color does not exixts.");
                }

                context.ICColorManager1.Remove(dbICColor);
                context.SaveChanges();

                return true;
            }
            else
            {
                return false;
            }
        }


    }
}