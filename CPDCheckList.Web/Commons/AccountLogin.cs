using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Commons
{
    public class AccountLogin
    {
        public int UserId { get; set; }
        public string UserCode { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int? RoleId { get; set; }
    }
}