using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Models.DAO
{
    public class UserDao
    {
        private CheckListDbContext db = null;
        public UserDao()
        {
            db = new CheckListDbContext();
        }

        /// <summary>
        /// Hàm lấy user theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>User</returns>
        public User GetById(int id)
        {
            var _user = db.Users.FirstOrDefault(u => u.UserId == id);
            return _user;
        }

        /// <summary>
        /// Hàm lấy thông tin người dùng dựa vào bộ username và password
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>User</returns>
        public User GetByAccount(string username, string password)
        {
            var user = db.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
            return user;
        }
    }
}