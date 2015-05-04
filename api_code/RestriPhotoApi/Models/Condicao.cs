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
    
    public partial class Condicao
    {
        public Condicao()
        {
            this.EstadoLua = new HashSet<EstadoLua>();
            this.EstadoMares = new HashSet<EstadoMares>();
            this.EstadoTempo = new HashSet<EstadoTempo>();
        }
    
        public long id { get; set; }
        public Nullable<int> segundaStatus { get; set; }
        public Nullable<int> tercaStatus { get; set; }
        public Nullable<int> quartaStatus { get; set; }
        public Nullable<int> quintaStatus { get; set; }
        public Nullable<int> sextaStatus { get; set; }
        public Nullable<int> sabadoStatus { get; set; }
        public Nullable<int> domingoStatus { get; set; }
        public Nullable<long> idRequisito { get; set; }
    
        public virtual Requisito Requisito { get; set; }
        public virtual ICollection<EstadoLua> EstadoLua { get; set; }
        public virtual ICollection<EstadoMares> EstadoMares { get; set; }
        public virtual ICollection<EstadoTempo> EstadoTempo { get; set; }
    }
}
