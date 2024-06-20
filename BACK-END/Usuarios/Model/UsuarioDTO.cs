using Usuarios.Modelo;

namespace Usuarios.DTO {
    
    public class UsuarioDTO {
        public string Dni { get; set; }
        public string NombreCompleto { get; set; }
        public string Username { get; set; }
        public string IdOAuth { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Telefono { get; set; }
        public string Password { get; set; }
    }

    public class UsuarioDTO2 {
        public string Dni { get; set; }
        public string NombreCompleto { get; set; }
        public String Rol { get; set; }
        public String Username { get; set; }
    }
}