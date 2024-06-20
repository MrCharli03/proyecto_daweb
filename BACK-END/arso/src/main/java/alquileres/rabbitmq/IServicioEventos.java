package alquileres.rabbitmq;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public interface IServicioEventos {
	
	void publicarEvento(String enrutamiento, String mensaje) throws IOException, TimeoutException;

	void subscrirEvento(String cola, String enrutamiento, EventHandler eventHandler) throws IOException, TimeoutException;
}
