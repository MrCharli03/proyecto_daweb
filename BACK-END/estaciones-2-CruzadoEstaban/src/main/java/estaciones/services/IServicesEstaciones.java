package estaciones.services;

import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import estaciones.dto.EstacionSinBicis;
import estaciones.modelo.Bici;
import estaciones.modelo.Estacion;
import estaciones.modelo.EstadoBici;
import repository.EntidadNoEncontrada;
import services.ServiceException;

@ComponentScan
public interface IServicesEstaciones {

	// Funciones Gestor
	String altaEstacion(String nombre, int numPuestos, String codPostal, double lat, double lng);

	String altaBici(String modelo, String idEstacion) throws ServiceException, EntidadNoEncontrada;

	void bajaBici(String idBici, String motivo) throws ServiceException, EntidadNoEncontrada;

	Page<Bici> getBicis(String idEstacion, Pageable pageable) throws EntidadNoEncontrada;

	// Funciones Todos los usuarios
	Page<Estacion> getEstaciones(String nombre, String codPostal, Integer numPuestos, Pageable pageable);

	EstacionSinBicis getInfoEstacion(String idEstacion) throws EntidadNoEncontrada;

	Page<Bici> getBicisDisponibles(String idEstacion, Pageable pageable) throws EntidadNoEncontrada;

	void estacionarBicicleta(String idBici, String idEstacion) throws ServiceException, EntidadNoEncontrada;

	// Funciones extra
	void retirarBici(String idBici) throws ServiceException, EntidadNoEncontrada;
	
	Bici getBici(String idBici) throws EntidadNoEncontrada;
	
	Estacion getEstacion(String idEstacion) throws EntidadNoEncontrada;

	void modificarEstacion(String idEstacion, String nombre, int numPuestos, String codPostal, double lat, double lng)
			throws EntidadNoEncontrada, ServiceException;

	void eliminarEstacion(String idEstacion) throws EntidadNoEncontrada, ServiceException;
	
	List<Bici> getAllBicis();

	void reservarBici(String idBici) throws EntidadNoEncontrada;

	void caducaReserva(String idBici) throws EntidadNoEncontrada;
	
	//void biciAlquilada(String idBici, String hora) throws EntidadNoEncontrada;

	//void cambiaEstadoBici(String idBici, EstadoBici estado) throws EntidadNoEncontrada;

}