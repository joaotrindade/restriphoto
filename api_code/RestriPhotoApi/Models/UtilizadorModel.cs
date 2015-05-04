using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RestriPhotoApi.Models
{
    public class UtilizadorModel : MessageModel
    {
        public long Id { get; set; }
        public string Name {get;set;}   
        public string Url {get;set;}
            
    }
}