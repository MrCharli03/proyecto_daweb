package alquileres.services;

import alquileres.modelo.Usuario;
import repository.EntidadNoEncontrada;
import repository.RepositorioException;
import services.ServiceAlquileresException;

public interface IServiceAlquileres {
	
	public void reservar(String idUsuario, String idBicicleta) throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException;
	
	public void confirmarReserva(String idUsuario) throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException;
	
	public void alquilar(String idUsuario, String idBicicleta) throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException;
	
	public Usuario historialUsuario(String idUsuario) throws RepositorioException, EntidadNoEncontrada;
	
	public void dejarBicicleta(String idUsuario, String idEstacion) throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException;
	
	public void liberarBloqueo(String idUsuario) throws RepositorioException, EntidadNoEncontrada;

	public void eliminarReservasActivasDeBici(String idBici) throws RepositorioException, EntidadNoEncontrada;

}
