package alquileres.rabbitmq;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;

public class ServicioEventos implements IServicioEventos {
	private static final String EXCHANGE_NAME = "citybike";
	// private static final String uri =
	// "amqps://fvoppdlj:23a-e4sOGwWL9IdY5EXGmuAFXktlL7Ct@stingray.rmq.cloudamqp.com/fvoppdlj";

	private static final String uri = System.getenv("RABBITMQ_URI");

	private ConnectionFactory connectionFactory;
	private Connection connection;
	private Channel channel;

	public ServicioEventos() {
		connectionFactory = new ConnectionFactory();
		try {
			connectionFactory.setUri(uri);

			connection = connectionFactory.newConnection();
			channel = connection.createChannel();
			channel.exchangeDeclare(EXCHANGE_NAME, "topic", true);

			channel.queueDeclare("citybike-alquileres", true, false, false, null);
			channel.queueBind("citybike-alquileres", EXCHANGE_NAME, "citybike.estaciones.bicicleta-desactivada");
		} catch (Exception e) {
			System.out.println("No se ha podido conectar con rabbitmq");
			System.exit(-1);
		}
	}

	@Override
	public void publicarEvento(String enrutamiento, String mensaje) throws IOException, TimeoutException {
		channel.basicPublish(EXCHANGE_NAME, enrutamiento, new AMQP.BasicProperties.Builder().build(),
				mensaje.getBytes());
	}

	@Override
	public void subscrirEvento(String cola, String enrutamiento, EventHandler eventHandler)
			throws IOException, TimeoutException {

		channel.basicConsume(cola, false, "alquileres-consumidor", new DefaultConsumer(channel) {
			@Override
			public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
					byte[] body) throws IOException {

				String routingKey = envelope.getRoutingKey();
				long deliveryTag = envelope.getDeliveryTag();
				String mensaje = new String(body);

				System.out.println("Routing Key: " + routingKey);
				System.out.println("Contenido: " + mensaje);

				eventHandler.handleEvent(routingKey, mensaje);

				channel.basicAck(deliveryTag, false);

			}
		});
	}

}