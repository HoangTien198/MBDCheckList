using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.BanDau
{
    public class BanDauAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "BanDau";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "BanDau_default",
                "BanDau/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}