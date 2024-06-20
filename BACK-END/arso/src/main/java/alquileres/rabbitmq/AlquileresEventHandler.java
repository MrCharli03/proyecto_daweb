package alquileres.rabbitmq;

import alquileres.services.IServiceAlquileres;
import alquileres.services.ServiceAlquileres;
import repository.EntidadNoEncontrada;
import repository.RepositorioException;
import services.FactoriaServicios;

public class AlquileresEventHandler implements EventHandler {

    private IServiceAlquileres alquileres;

    public AlquileresEventHandler(IServiceAlquileres service) {
        this.alquileres = service;
    }

    @Override
    public void handleEvent(String enrutamiento, String mensaje) {
        System.out.println("Evento recibido en el microservicio de Alquileres: " + mensaje);
        
        if (enrutamiento.equals("citybike.estaciones.bicicleta-desactivada")) {
            String[] partes = mensaje.split(": ");
            String idBici = partes[1];
            
            try {
                alquileres.eliminarReservasActivasDeBici(idBici);
            } catch (RepositorioException | EntidadNoEncontrada e) {
                e.printStackTrace();
            }
        } else System.out.println("Routing key equivocada: " + enrutamiento);
    }
}