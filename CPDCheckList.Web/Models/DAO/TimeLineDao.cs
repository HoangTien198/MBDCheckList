using CPDCheckList.Web.Models.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CPDCheckList.Web.Models.DAO
{
    public class TimeLineDao
    {
        private CheckListDbContext db = null;
        public TimeLineDao()
        {
            db = new CheckListDbContext();
        }

        public TimeLine GetById(int timeLineId)
        {
            var result = db.TimeLines.FirstOrDefault(t => t.TimeLineId == timeLineId);
            return result;
        }
    }
}