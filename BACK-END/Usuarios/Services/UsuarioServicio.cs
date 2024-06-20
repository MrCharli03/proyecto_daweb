using System.Globalization;
using Repositorio;
using Usuarios.DTO;
using Usuarios.Modelo;
using Usuarios.Repositorio;

namespace Usuarios.Servicio
{

    public interface IServicioUsuarios
    {
        Usuario GetUsuario(string username);
        Usuario Get(string usuarioId);
        Usuario GetUsuarioByDni(string dni);
        string SolicitarCodigoActivacion(string dni);
        string AltaUsuario(UsuarioDTO usuario);
        void BajaUsuario(string usuarioId);
        UsuarioDTO2 VerificarCredenciales(string username, string password);
        UsuarioDTO2 VerificarUsuarioOAuth2(string oauth2Id);
        List<Usuario> ListarUsuarios();
    }

    public class ServicioUsuarios : IServicioUsuarios
    {

        private IRepositorioUsuarios<Usuario> repositorioUsuarios;
        private Repositorio<CodigoActivacion, String> repositorioCodigos;

        public ServicioUsuarios( IRepositorioUsuarios<Usuario> repositorioU, Repositorio<CodigoActivacion, String> repositorioC)
        {
            this.repositorioUsuarios=repositorioU;
            this.repositorioCodigos=repositorioC;
        }

        public string SolicitarCodigoActivacion(string dni)
        {
            var codigo = new CodigoActivacion
            {
                UsuarioId = dni,
                FechaCreacion = DateTime.UtcNow,
                FechaExpiracion = DateTime.UtcNow.AddDays(1),// El código expira en 1 día
                Codigo = "",
                Usado = false
            };
            var id = repositorioCodigos.Add(codigo);

            // Formato para las fechas
            string formatoFecha = "yyyy-MM-ddTHH:mm:ssZ"; // ISO 8601 format

            // Crear el string de respuesta
            string respuesta = $"{id}NC{codigo.FechaCreacion.ToString(formatoFecha)}NC{codigo.FechaExpiracion.ToString(formatoFecha)}NC{codigo.UsuarioId}";

            codigo.Codigo = respuesta;
            
            repositorioCodigos.Update(codigo);
            
            return respuesta;
        }

        public string AltaUsuario(UsuarioDTO usuario)
        {

            Usuario existeUser = repositorioUsuarios.GetByUsername(usuario.Username);
            Usuario existeDni = repositorioUsuarios.GetByUsername(usuario.Dni);

            if (existeUser == null && existeDni == null)
            {

                string contrasena = null;
                string idOAuth = null;

                if (usuario.Password == "" || usuario.Password == " " || usuario.Password == null) {
                    contrasena = "";
                    idOAuth = usuario.IdOAuth;
                } else if (usuario.IdOAuth == "" || usuario.IdOAuth == " " || usuario.IdOAuth == null) {
                    contrasena = usuario.Password;
                    idOAuth = "";
                } else throw new Exception("No tiene ni contraseña ni IdOAuth2.");

                var usuarioModelo = new Usuario
                {
                    Dni = usuario.Dni,
                    NombreCompleto = usuario.NombreCompleto,
                    Username = usuario.Username,
                    Rol = UserRol.Cliente.ToString(),
                    IdOAuth = idOAuth,
                    FechaNacimiento = usuario.FechaNacimiento,
                    Telefono = usuario.Telefono,
                    Password = contrasena
                };

                repositorioUsuarios.Add(usuarioModelo);
                return usuarioModelo.Id;
            }
            throw new Exception("El usuario ya existe");
        }

        public void BajaUsuario(string usuarioId)
        {
            var usuario = repositorioUsuarios.GetById(usuarioId);
            if (usuario != null)
            {
                repositorioUsuarios.Delete(usuario);
            }
            else
            {
                throw new Exception("Usuario no encontrado.");
            }
        }

        public UsuarioDTO2 VerificarCredenciales(string username, string password)
        {
            var usuario = repositorioUsuarios.GetByUsername(username);

            if (usuario == null)
            {
                throw new Exception("El usuario no existe.");
            }

            if (usuario.Password != password)
            {
                throw new Exception("Contraseña errónea.");
            }

            var usuarioDTO = new UsuarioDTO2
            {
                Dni = usuario.Dni,
                NombreCompleto = usuario.NombreCompleto,
                Rol = usuario.Rol.ToString(),
                Username = username
            };

            return usuarioDTO ;
        }

        public UsuarioDTO2 VerificarUsuarioOAuth2(string oauth2Id)
        {
            var usuario = repositorioUsuarios.GetAll().Find(u => u.IdOAuth == oauth2Id);

            if (usuario == null)
            {
                throw new Exception("No se encontró usuario con el identificador OAuth2 proporcionado.");
            }

            var usuarioDTO = new UsuarioDTO2
            {
                Dni = usuario.Dni,
                NombreCompleto = usuario.NombreCompleto,
                Rol = usuario.Rol.ToString(),
                Username = usuario.Username
            };

            return usuarioDTO;
        }

        public List<Usuario> ListarUsuarios()
        {
            return repositorioUsuarios.GetAll();
        }

        public Usuario Get(string usuarioId)
        {
            return repositorioUsuarios.GetById(usuarioId);
        }

        public Usuario GetUsuario(string username)
        {
            return repositorioUsuarios.GetByUsername(username);
        }

        public Usuario GetUsuarioByDni(string dni)
        {
            return repositorioUsuarios.GetByDni(dni);
        }
    }
}
