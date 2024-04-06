using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.ICColor
{
    public class ICColorAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ICColor";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "ICColor_default",
                "ICColor/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}