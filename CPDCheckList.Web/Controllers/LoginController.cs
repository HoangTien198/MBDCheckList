using CPDCheckList.Web.Commons;
using CPDCheckList.Web.Models.DAO;
using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        private CheckListDbContext db = null;
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Hàm thực hiện lời gọi ajax đăng nhập tài khoản
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>0: đăng nhập sai | 1: TE | 2: chuyền trưởng | 3: IPQC | -1: Not permission</returns>
        [HttpPost]
        public JavaScriptResult CheckLogin(string username, string password)
        {
            if (!string.IsNullOrEmpty(username) || !string.IsNullOrEmpty(password))
            {
                //đã có username và password
                LoginDao loginDao = new LoginDao();
                int checkLogin = loginDao.checkLogin(username, password);

                switch (checkLogin)
                {
                    case 0:
                        {
                            return JavaScript("endload();Swal.fire(\"Đăng nhập không thành công!\", \"Kiểm tra lại thông tin tài khoản và mật khẩu!\", \"error\");");
                        }
                    case 1: //TE
                        {
                            var userDao = new UserDao();
                            var user = userDao.GetByAccount(username, password);
                            //Gán Session:
                            var userSession = new AccountLogin();
                            userSession.Username = user.Username;
                            userSession.Password = user.Password;
                            userSession.RoleId = user.RoleId;
                            userSession.UserId = user.UserId;
                            userSession.UserCode = user.UserCode;

                            Session.Add(CommonConstant.USER_SESSION, userSession);

                            return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập với vai trò TE! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/Dashboard/Home/Home';");
                        }
                    case 2: // Line Leader
                        {
                            var userDao = new UserDao();
                            var user = userDao.GetByAccount(username, password);
                            var userSession = new AccountLogin();
                            userSession.Username = user.Username;
                            userSession.Password = user.Password;
                            userSession.RoleId = user.RoleId;
                            userSession.UserId = user.UserId;
                            userSession.UserCode = user.UserCode;
                            Session.Add(CommonConstant.USER_SESSION, userSession);
                            return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập với vai trò Line Leader! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/Dashboard/Home/Home';");
                        }
                    case 3: // IPQC
                        {
                            var userDao = new UserDao();
                            var user = userDao.GetByAccount(username, password);
                            var userSession = new AccountLogin();
                            userSession.Username = user.Username;
                            userSession.Password = user.Password;
                            userSession.RoleId = user.RoleId;
                            userSession.UserId = user.UserId;
                            userSession.UserCode = user.UserCode;
                            Session.Add(CommonConstant.USER_SESSION, userSession);
                            return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập với vai trò IPQC! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/Dashboard/Home/Home';");
                        }
                    case 4:
                        {
                            var userDao = new UserDao();
                            var user = userDao.GetByAccount(username, password);
                            var userSession = new AccountLogin();
                            userSession.Username = user.Username;
                            userSession.Password = user.Password;
                            userSession.RoleId = user.RoleId;
                            userSession.UserId = user.UserId;
                            userSession.UserCode = user.UserCode;
                            Session.Add(CommonConstant.USER_SESSION, userSession);
                            return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập với vai trò IPQC! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/Dashboard/Home/Home';");
                        }
                    case 6: //PQE
                        {
                            var userDao = new UserDao();
                            var user = userDao.GetByAccount(username, password);
                            var userSession = new AccountLogin();
                            userSession.Username = user.Username;
                            userSession.Password = user.Password;
                            userSession.RoleId = user.RoleId;
                            userSession.UserId = user.UserId;
                            userSession.UserCode = user.UserCode;
                            Session.Add(CommonConstant.USER_SESSION, userSession);
                            return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập với vai trò PQE! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/Dashboard/Home/Home';");
                        }
                    case 7: // TE
                        {
                            var userDao = new UserDao();
                            var user = userDao.GetByAccount(username, password);
                            var userSession = new AccountLogin();
                            userSession.Username = user.Username;
                            userSession.Password = user.Password;
                            userSession.RoleId = user.RoleId;
                            userSession.UserId = user.UserId;
                            userSession.UserCode = user.UserCode;
                            Session.Add(CommonConstant.USER_SESSION, userSession);
                            return JavaScript("endload();Swal.fire(\"Success!\", \"Đang đăng nhập với vai trò TE! Vui lòng chờ trong giây lát...\", \"success\");window.location = '/Dashboard/Home/Home';");
                        }
                    default:
                        {
                            return JavaScript("window.location = '/ErrorPage/Error404/Index'");
                        }
                }
            }
            else
            {
                //validate empty username, password
                return JavaScript("window.location = '/Login/Index'");
            }

        }

        /// <summary>
        /// Hàm logout
        /// </summary>
        /// <returns>View</returns>
        public ActionResult Logout()
        {
            Session[CommonConstant.USER_SESSION] = null;
            return RedirectToAction("Index", "Login");
        }

        public ActionResult LoginCallback()
        {
            try
            {
                string code = Request.Params["code"];

                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(code);

                var username = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == "username").Value;

                Session["OauthCode"] = code;
                db = new CheckListDbContext();
                var user = db.Users.FirstOrDefault(u => u.Username == username);


                if (user != null)
                {
                    CheckLogin(user.Username, user.Password);
                    return RedirectToAction("Home", "Home", new { area = "Dashboard" });
                }
                else
                {
                    return JavaScript("endload();Swal.fire(\"Đăng nhập không thành công!\", \"Kiểm tra lại thông tin tài khoản và mật khẩu!\", \"error\");");
                }
            }
            catch (Exception ex)
            {
                return RedirectToAction("Error404", "ErrorPage");
            }
        }
    }
}