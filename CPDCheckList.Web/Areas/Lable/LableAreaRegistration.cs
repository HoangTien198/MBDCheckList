using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.Lable
{
    public class LableAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Lable";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Lable_default",
                "Lable/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}