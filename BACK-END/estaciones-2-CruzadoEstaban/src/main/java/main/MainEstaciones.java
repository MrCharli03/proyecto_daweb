package main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import estaciones.EstacionesApp;
import estaciones.services.IServicesEstaciones;
import repository.EntidadNoEncontrada;
import services.ServiceException;

@SpringBootApplication
public class MainEstaciones {

	public static void main(String[] args) throws ServiceException, EntidadNoEncontrada {

		ConfigurableApplicationContext contexto = SpringApplication.run(EstacionesApp.class, args);
		
		IServicesEstaciones estaciones = contexto.getBean(IServicesEstaciones.class);
		
		String idEstacion = estaciones.altaEstacion("Murcia Centro", 4, "30001", 37.98404304367661,
				-1.1285752035593704);
		String idEstacion2 = estaciones.altaEstacion("Madrid", 10, "28012", 40.415474911679816, -3.7036610762132898);
		String idEstacion3 = estaciones.altaEstacion("Albacete", 5, "02001", 38.99416876987925, -1.8601819551730283);
		String idEstacion4 = estaciones.altaEstacion("Catagena", 3, "30204", 37.61623450179514, -0.9893158794143939);
		
		System.out.println("Estacion1: " + idEstacion);
		System.out.println("Estacion2: " + idEstacion2);
		System.out.println("Estacion3: " + idEstacion3);
		System.out.println("Estacion4: " + idEstacion4);
		System.out.println();

		String idBici1 = estaciones.altaBici("MTB de montaña eléctrica", idEstacion);
		String idBici2 = estaciones.altaBici("KTM X-Strada Elite", idEstacion);
		String idBici3 = estaciones.altaBici("BH Atom Lynx 8.0", idEstacion);
		String idBici4 = estaciones.altaBici("Conor Ray", idEstacion);
		String idBici5 = estaciones.altaBici("Berria Belador 5.1", idEstacion2);
		String idBici6 = estaciones.altaBici("Merida Big Nine 4000", idEstacion3);
		String idBici7 = estaciones.altaBici("Caracu XL", idEstacion4);
		String idBici8 = estaciones.altaBici("BMX WoW roll", idEstacion4);
		
		System.out.println("Bici1: " + idBici1);
		System.out.println("Bici2: " + idBici2);
		System.out.println("Bici3: " + idBici3);
		System.out.println("Bici4: " + idBici4);
		System.out.println("Bici5: " + idBici5);
		System.out.println("Bici6: " + idBici6);
		System.out.println("Bici7: " + idBici7);
		System.out.println("Bici8: " + idBici8);

		
		contexto.close();
	}

}