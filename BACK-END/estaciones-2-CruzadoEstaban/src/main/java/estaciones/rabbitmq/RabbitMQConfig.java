package estaciones.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Exchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

	public static final String QUEUE_NAME = "citybike-estaciones";
	public static final String EXCHANGE_NAME = "citybike";
	public static final String ROUTING_KEY = "citybike.estaciones.bicicleta-desactivada";
	public static final String ROUTING_KEY_ALQUILER = "citybike.alquileres.bicicleta-alquilada";
	public static final String ROUTING_KEY_ALQUILER_CONCLUIDO = "citybike.alquileres.bicicleta-alquiler-concluido";
	public static final String ROUTING_KEY_RESERVA = "citybike.alquileres.bicicleta-reservada";
	public static final String ROUTING_KEY_RESERVA_CADUCADA = "citybike.alquileres.reserva-caducada";

	@Bean
	public TopicExchange exchange() {
		return new TopicExchange(EXCHANGE_NAME);
	}

	@Bean
	public Queue queue() {
		boolean durable = true;
		boolean exclusive = false;
		boolean autodelete = false;
		return new Queue(QUEUE_NAME, durable, exclusive, autodelete);
	}

	@Bean
	public Binding bindingAlquiler(Queue queue, Exchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_ALQUILER).and(null);
	}

	@Bean
	public Binding bindingAlquilerConcluido(Queue queue, Exchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_ALQUILER_CONCLUIDO).and(null);
	}
	
	@Bean
	public Binding bindingReserva(Queue queue, Exchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_RESERVA).and(null);
	}

	@Bean
	public Binding bindingReservaCaducada(Queue queue, Exchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_RESERVA_CADUCADA).and(null);
	}

	@Bean
	public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
		RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
		return rabbitTemplate;
	}

}