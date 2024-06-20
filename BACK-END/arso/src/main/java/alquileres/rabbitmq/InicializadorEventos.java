package alquileres.rabbitmq;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import alquileres.services.IServiceAlquileres;
import services.FactoriaServicios;

public class InicializadorEventos implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		IServiceAlquileres alquileres = FactoriaServicios.getServicio(IServiceAlquileres.class);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// nada
	}
}