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

namespace CPDCheckList.Web.Areas.ICColor.DAO
{
    internal class R_ICColor
    {
        private static readonly ICColorManager context = new ICColorManager();

        /* GET */
        public static object GetICColors()
        {
            var ICColors = context.ICColors.ToList();

            var ICColorsByCustomer = ICColors
            .GroupBy(ic => ic.Customer)
            .ToDictionary(
                group => group.Key,
                group => group.ToList()
            );

            return ICColorsByCustomer;
        }
        public static Data.ICColor GetICColor(int Id)
        {
            var ICColor = context.ICColors.FirstOrDefault(ic => ic.Id == Id);

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
        public static Data.ICColor CreateICColor(Data.ICColor icColor)
        {
            try
            {
                Random random = new Random();
                int randomMinutes = random.Next(10, 31);
                DateTime currentDateTime = DateTime.Now;
                DateTime newDateTime = currentDateTime.AddMinutes(randomMinutes);

                AccountLogin userLogin = (AccountLogin)HttpContext.Current.Session["USER_SESSION"];

                if (string.IsNullOrEmpty(icColor.Customer)) throw new Exception("Please create new Customer before create new record.");

                Data.ICColorStatus icColorStatus = new ICColorStatus
                {
                    IdUser1 = 119,
                    IdUser2 = 179,
                    Startus = "Confirmed",
                    Datetime = newDateTime,
                    IdUserCreated = userLogin.UserId
                };

                icColor.CreatedDate = currentDateTime;
                icColor.Status = icColorStatus;
                context.ICColors.Add(icColor);

                context.SaveChanges();

                return GetICColor(icColor.Id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
           
        }
        public static Data.ICColor UpdateICColor(Data.ICColor icColor)
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
            dbICColor.MachineName = icColor.MachineName;
            dbICColor.MachineType = icColor.MachineType;
            dbICColor.ICCode = icColor.ICCode;
            dbICColor.ICParameter = icColor.ICParameter;
            dbICColor.Checksum = icColor.Checksum;
            dbICColor.SocketBoard = icColor.SocketBoard;
            dbICColor.Improver = icColor.Improver;
            dbICColor.Step = icColor.Step;
            dbICColor.Time = icColor.Time;
            dbICColor.IsCheck = icColor.IsCheck;
            dbICColor.ChangeDate = icColor.ChangeDate;
            dbICColor.IdStatus = icColor.IdStatus;


            context.ICColors.AddOrUpdate(dbICColor);
            context.SaveChanges();

            return dbICColor;
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

                context.ICColors.Remove(dbICColor);
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