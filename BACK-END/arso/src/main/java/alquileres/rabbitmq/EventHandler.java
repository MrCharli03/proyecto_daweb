package alquileres.rabbitmq;

public interface EventHandler {
	
	void handleEvent(String enrutamiento, String mensaje);
}