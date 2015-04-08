using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RestriPhotoServer.Models
{
    public class UtilizadorModel : MessageModel
    {
        //
        // GET: /UtilizadorModel/
        public long Id { get; set; }

        public string Name { get; set; }
        public string Url { get; set; }

    }
}
