using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.LabelSample
{
    public class LabelSampleAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "LabelSample";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "LabelSample_default",
                "LabelSample/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}