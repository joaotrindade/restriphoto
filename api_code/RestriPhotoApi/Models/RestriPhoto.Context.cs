﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class restriphotoEntities : DbContext
    {
        public restriphotoEntities()
            : base("name=restriphotoEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<Condicao> Condicao { get; set; }
        public DbSet<EstadoLua> EstadoLua { get; set; }
        public DbSet<EstadoMares> EstadoMares { get; set; }
        public DbSet<EstadoTempo> EstadoTempo { get; set; }
        public DbSet<Porto> Porto { get; set; }
        public DbSet<Requisito> Requisito { get; set; }
        public DbSet<sysdiagrams> sysdiagrams { get; set; }
        public DbSet<Utilizador> Utilizador { get; set; }
    }
}
