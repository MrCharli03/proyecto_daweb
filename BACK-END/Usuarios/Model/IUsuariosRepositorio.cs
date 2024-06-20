using Usuarios.Modelo;

namespace Repositorio
{
    public interface IRepositorioUsuarios<Usuario>: Repositorio<Usuario, String>
    {
        Usuario GetByUsername(string username);
        Usuario GetByDni(string dni);
    }
}
