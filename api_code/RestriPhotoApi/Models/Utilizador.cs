//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RestriPhotoApi.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Utilizador
    {
        public Utilizador()
        {
            this.Requisito = new HashSet<Requisito>();
        }
    
        public long id { get; set; }
        public string nome { get; set; }
        public string password { get; set; }
        public string url { get; set; }
    
        public virtual ICollection<Requisito> Requisito { get; set; }
    }
}
