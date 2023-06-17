using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.RutKiem
{
    public class RutKiemAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "RutKiem";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "RutKiem_default",
                "RutKiem/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}