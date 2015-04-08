using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using RestriPhotoServer.Models;
using System.Web.Helpers;
using System.Text;

namespace RestriPhotoServer.Controllers
{
    public class UtilizadorController : ApiController
    {
        private restriphotoEntities db = new restriphotoEntities();

 
        
        [HttpGet]
        public UtilizadorModel Utilizador(long id)
        {
            Utilizador utilizador = db.Utilizador.Find(id);
            
            UtilizadorModel u = new UtilizadorModel();

            if (utilizador == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            u.Id = utilizador.id;
            u.Name = utilizador.nome;
            u.Url = utilizador.url;

            return u;
        }

        private string Hash(string input)
        {
            // step 1, calculate MD5 hash from input
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }

        // PUT api/Utilizador?name=xxx?password=dsdasdasd
        [HttpGet]
        public MessageModel LoginUtilizador(string name, string password)
        {
            Utilizador utilizador = db.Utilizador.FirstOrDefault(a => a.nome == name);
            if (utilizador == null)
            {
                MessageModel m1 = new MessageModel();
                m1.StatusCode = 666;
                m1.Message = "Utilizador nao existente";
                return m1;
            }

            UtilizadorModel u = new UtilizadorModel();
            u.Name = utilizador.nome;
            
            if(Hash(password) == utilizador.password)
            {
                u.Id = utilizador.id;
                u.Url = utilizador.url;
                u.StatusCode = 200;
                u.Message = "Login Efectuado com Sucesso";
                return u;
            }
            else
            {
                MessageModel m1 = new MessageModel();
                m1.StatusCode = 666;
                m1.Message = "Password Errada";
                return m1;
            }

        }

        // POST api/Utilizador
        public HttpResponseMessage PostUtilizador(Utilizador utilizador)
        {
            if (ModelState.IsValid)
            {
                db.Utilizador.Add(utilizador);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, utilizador);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = utilizador.id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Utilizador/5
        public HttpResponseMessage DeleteUtilizador(long id)
        {
            Utilizador utilizador = db.Utilizador.Find(id);
            if (utilizador == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Utilizador.Remove(utilizador);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, utilizador);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}