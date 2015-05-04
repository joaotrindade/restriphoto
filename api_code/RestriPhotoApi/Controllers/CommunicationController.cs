using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RestriPhotoApi.Communication;
using RestriPhotoApi.Models;

namespace RestriPhotoApi.Controllers
{
    public class CommunicationController : ApiController
    {
        // GET api/communication
        [HttpGet]
        public MessageModel CommunicationTest(string s)
        {
            DailyTask a1 = new DailyTask();
            a1.s = "comando(1,2)";
            a1.Execute();
            MessageModel m1 = new MessageModel();
            return m1;
        }
    }
}
