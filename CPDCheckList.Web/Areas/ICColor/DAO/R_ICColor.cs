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
            ICColor.ICColorHistories = context.HistoryICColors.Where(ich => ich.IdICColor ==  Id).ToList();

            //ICColor.ICColorStatuss.FirstOrDefault().UserCreated = context.User_ICColor.FirstOrDefault(u => u.UserId == ICColor.Improver);

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

                if (string.IsNullOrEmpty(icColor.Customer)) throw new Exception("Please create new Customer before create new record.");

                icColor.CreatedDate = currentDateTime;
                context.ICColors.Add(icColor);

                StatusICColor icColorStatus = new StatusICColor
                {
                    IdICColor = icColor.Id,
                    IdUser1 = 119,
                    IdUser2 = 179,
                    Status = "Confirmed",
                    Datetime = newDateTime,
                    IdUserCreated = icColor.Improver
                };

                context.StatusICColors.Add(icColorStatus);
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
            AccountLogin userLogin = (AccountLogin)HttpContext.Current.Session["USER_SESSION"];
            if (userLogin.UserId == 119 || userLogin.UserId == 179 || userLogin.UserId == 1189)
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

                var history = CreateICColorHistory(dbICColor);

                dbICColor.Customer = icColor.Customer;
                dbICColor.ProgramName = icColor.ProgramName;
                dbICColor.MachineType = icColor.MachineType;
                dbICColor.ICCode = icColor.ICCode;
                dbICColor.ICParameter = icColor.ICParameter;
                dbICColor.Checksum = icColor.Checksum;
                dbICColor.SocketBoard = icColor.SocketBoard;
                dbICColor.Improver = userLogin.UserId;
                dbICColor.Step = icColor.Step;
                dbICColor.Time = icColor.Time;
                dbICColor.ChangeDate = icColor.ChangeDate;
                dbICColor.ICColorStatus.FirstOrDefault().IdUserCreated = icColor.Improver;

                return GetICColor(dbICColor.Id);
            }
            else
            {
                throw new Exception("No Access.");
            }
                
        }
        public static bool DeleteICColor(int Id)
        {

            AccountLogin userLogin = (AccountLogin)HttpContext.Current.Session["USER_SESSION"];
            if (userLogin.UserId == 119 || userLogin.UserId == 179 || userLogin.UserId == 1189)
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


        public static HistoryICColor CreateICColorHistory(Data.ICColor icColor)
        {
            try
            {
                AccountLogin userLogin = (AccountLogin)HttpContext.Current.Session["USER_SESSION"];
                var history = new HistoryICColor
                {
                    IdICColor = icColor.Id,
                    Customer = icColor.Customer,
                    ProgramName = icColor.ProgramName,
                    MachineType = icColor.MachineType,
                    ICCode = icColor.ICCode,
                    ICParameter = icColor.ICParameter,
                    Checksum = icColor.Checksum,
                    SocketBoard = icColor.SocketBoard,
                    Improver = icColor.Improver,
                    Step = icColor.Step,
                    Time = icColor.Time,
                    ChangeDate = icColor.ChangeDate,
                };

                context.HistoryICColors.Add(history);

                var status = icColor.ICColorStatus.FirstOrDefault();
                var historyStatus = new StatusHistoryICColor
                {
                    IdICColorHistory = history.Id,
                    IdUser1 = status.IdUser1,
                    IdUser2 = status.IdUser2,
                    IdUserCreated = status.IdUserCreated,
                    Status = status.Status,
                    Datetime = status.Datetime,
                    Note = status.Note,
                };


                context.StatusHistoryICColors.Add(historyStatus);
                context.SaveChanges();

                history.ICColorStatusHistories.Add(historyStatus);

                return history;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

    }
}