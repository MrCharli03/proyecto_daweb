package main;

import alquileres.modelo.Usuario;
import alquileres.services.IServiceAlquileres;
import repository.EntidadNoEncontrada;
import repository.RepositorioException;
import services.FactoriaServicios;
import services.ServiceAlquileresException;

public class MainAlquileres {

	public static void main(String[] args) throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {

		IServiceAlquileres alquileres = FactoriaServicios.getServicio(IServiceAlquileres.class);

		alquileres.reservar("1", "1");
		Usuario u = alquileres.historialUsuario("1");
		System.out.println(u);
		alquileres.confirmarReserva("1");
		alquileres.alquilar("2", "3");
		u = alquileres.historialUsuario("1");
		Usuario u2 = alquileres.historialUsuario("2");
		System.out.println(u);
		System.out.println(u2);
		alquileres.dejarBicicleta("3", "661547f0b0fa554d5990908e");
		alquileres.liberarBloqueo("1");
	
	}

}
