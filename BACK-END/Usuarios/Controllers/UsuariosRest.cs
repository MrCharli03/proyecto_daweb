using Microsoft.AspNetCore.Mvc;
using UsuarioRegistrado.DTO;
using Usuarios.DTO;
using Usuarios.Modelo;
using Usuarios.Servicio;

namespace UsuariosAPI.Controllers {

    [Route("api/usuarios")]
    [ApiController]
    public class UsuariosController : ControllerBase {
        private readonly IServicioUsuarios _servicioUsuarios;

        public UsuariosController(IServicioUsuarios servicioUsuarios) {
            this._servicioUsuarios = servicioUsuarios;
        }

        [HttpGet(Name = "GetAllUsuarios")]
        public ActionResult<List<Usuario>> ListarUsuarios() {
            return _servicioUsuarios.ListarUsuarios();
        }

        [HttpPost("solicitudesCodigos", Name = "SolicitarCodigoActivacion")]
        public ActionResult<string> SolicitarCodigoActivacion([FromBody] string usuarioId) {
            return _servicioUsuarios.SolicitarCodigoActivacion(usuarioId);
        }

        [HttpPost("register",Name = "AltaUsuario")]
        public IActionResult AltaUsuario([FromBody] UsuarioDTO usuario) {
            if (usuario == null) {
                return BadRequest();
            }
            if (_servicioUsuarios.GetUsuario(usuario.Username) != null) {
                return BadRequest("El usuario ya está registrado con este username.");
            }
            if (_servicioUsuarios.GetUsuarioByDni(usuario.Dni) != null) {
                return BadRequest("El usuario ya está registrado con este dni.");
            }
            _servicioUsuarios.AltaUsuario(usuario);
            return NoContent();
        }

        [HttpDelete("bajaUsuario", Name = "BajaUsuario")]
        public IActionResult BajaUsuario([FromQuery]string usuarioId) {
            var entidad = _servicioUsuarios.Get(usuarioId);
            if (entidad == null) {
                return NotFound();
            }
            _servicioUsuarios.BajaUsuario(usuarioId);
            return NoContent();
        }

        [HttpPost("credenciales", Name = "VerificarCredenciales")]
        public ActionResult<UsuarioDTO2> VerificarCredenciales([FromBody] UsuarioRegistradoDTO usuario) {
            return _servicioUsuarios.VerificarCredenciales(usuario.Username, usuario.Password);
        }

        [HttpGet("oauth2", Name = "VerificarUsuarioOAuth2")]
        public ActionResult<UsuarioDTO2> VerificarUsuarioOAuth2([FromQuery] string oauth2Id) {
            return _servicioUsuarios.VerificarUsuarioOAuth2(oauth2Id);
        }
    }
}
