using CPDCheckList.Web.Commons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.BanDau.Controllers
{
    public class BaseControllerController : Controller
    {
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            var session = (AccountLogin)Session[CommonConstant.USER_SESSION];
            if (session == null)
            {
                filterContext.Result = new RedirectResult("/Login/Index");
                return;
            }
            else
            {
                if (session.RoleId != 3)
                {
                    filterContext.Result = new RedirectResult("/ErrorPage/Error404");
                    return;
                }
            }
            base.OnActionExecuted(filterContext);
        }
    }
}