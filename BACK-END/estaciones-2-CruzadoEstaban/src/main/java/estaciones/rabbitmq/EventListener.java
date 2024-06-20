package estaciones.rabbitmq;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import estaciones.services.IServicesEstaciones;
import repository.EntidadNoEncontrada;
import services.ServiceException;

@Component
public class EventListener {

	private IServicesEstaciones servicioEstaciones;

	@Autowired
	public EventListener(IServicesEstaciones servicioEstaciones) {
		this.servicioEstaciones = servicioEstaciones;
	}

	@RabbitListener(queues = "citybike-estaciones")
	public void handleEvent(Message evento) {
		System.out.println("Evento recibido en el microservicio de Estaciones: " + evento);

		String body = new String(evento.getBody());
		String[] partes;
		String[] idBiciParte;
		String[] idEstacionParte;
		String idBici;
		String idEstacion;

		switch (evento.getMessageProperties().getReceivedRoutingKey()) {
		case "citybike.alquileres.bicicleta-reservada":
			partes = body.split(", ");
			idBiciParte = partes[0].split(": ");
			idBici = idBiciParte[1];
			
			try {
				servicioEstaciones.reservarBici(idBici);
			} catch (EntidadNoEncontrada e) {
				e.printStackTrace();
			}
			break;
		case "citybike.alquileres.reserva-caducada":
			partes = body.split(": ");
			idBici = partes[1];
			
			try {
				servicioEstaciones.caducaReserva(idBici);
			} catch (EntidadNoEncontrada e) {
				e.printStackTrace();
			}
			break;
		case "citybike.alquileres.bicicleta-alquilada":
			partes = body.split(", ");
			idBiciParte = partes[0].split(": ");
			idBici = idBiciParte[1];

			try {
				//servicioEstaciones.cambiaEstadoBici(idBici, EstadoBici.NODISPONIBLE);
				servicioEstaciones.retirarBici(idBici);
			} catch (EntidadNoEncontrada | ServiceException e) {
				e.printStackTrace();
			}
			break;
		case "citybike.alquileres.bicicleta-alquiler-concluido":
			partes = body.split(", ");
			idBiciParte = partes[0].split(": ");
			idBici = idBiciParte[1];
			idEstacionParte = partes[1].split(": ");
			idEstacion = idEstacionParte[1];
			try {
				//servicioEstaciones.cambiaEstadoBici(idBici, EstadoBici.DISPONIBLE);
				servicioEstaciones.estacionarBicicleta(idBici, idEstacion);
			} catch (EntidadNoEncontrada | ServiceException e) {
				e.printStackTrace();
			}
			break;
		default:
			System.out.println("Routing key equivocada: " + evento.getMessageProperties().getReceivedRoutingKey());

			break;
		}

		System.out.println("Cuerpo: " + body);

	}
}