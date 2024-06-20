
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Usuarios.Modelo
{
    public class Usuario
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Dni { get; set; }
        public string NombreCompleto { get; set; }
        public string Username { get; set; }
        public string Rol { get; set; }
        public string IdOAuth { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Telefono { get; set; }
        public string Password { get; set; }
    }
    
    public enum UserRol
    {
        Gestor,
        Cliente
    }

    public class CodigoActivacion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Codigo { get; set; }
        public string UsuarioId { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaExpiracion { get; set; }
        public Boolean Usado { get; set; }
    }
}