using FluentScheduler;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RestriPhotoApi.Communication
{
    public class DailyRegistry : Registry
    {
        public DailyRegistry()
        {
            Schedule<DailyTask>().ToRunEvery(1).Days();
        }
    }
}