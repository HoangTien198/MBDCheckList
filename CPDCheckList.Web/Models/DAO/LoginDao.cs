using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Models.DAO
{
    public class LoginDao
    {
        private CheckListDbContext db = null;
        public LoginDao()
        {
            db = new CheckListDbContext();
        }

        /// <summary>
        /// Hàm kiểm tra đăng nhập
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>0: đăng nhập sai | 1: TE | 2: chuyền trưởng | 3: IPQC | 4: ADMIN</returns>
        public int checkLogin(string username, string password)
        {
            var user = db.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
            if (user == null)//Đăng nhập sai
            {
                return 0;
            }
            else
            {
                if (user.RoleId == 1)//TE
                {
                    return 1;
                }
                else if (user.RoleId == 2)//chuyền trưởng
                {
                    return 2;
                }
                else if (user.RoleId == 3)//IPQC
                {
                    return 3;
                }
                else return 4;//Admin
            }
        }//End check login
    }
}