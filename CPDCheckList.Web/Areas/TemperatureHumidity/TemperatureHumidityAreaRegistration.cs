using System.Web.Mvc;

namespace CPDCheckList.Web.Areas.TemperatureHumidity
{
    public class TemperatureHumidityAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "TemperatureHumidity";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "TemperatureHumidity_default",
                "TemperatureHumidity/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}