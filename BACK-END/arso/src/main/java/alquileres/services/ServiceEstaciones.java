package alquileres.services;

import java.io.IOException;

import alquileres.dtos.EstacionSinBicis;
import alquileres.retrofit.EstacionesRestClient;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;
import services.ServiceAlquileresException;

public class ServiceEstaciones {

	//String url = "http://localhost:8080/";
	String url = "http://estaciones-service:8080/";
	
	Retrofit retrofit = new Retrofit.Builder().baseUrl(url)
			.addConverterFactory(JacksonConverterFactory.create()).build();

	EstacionesRestClient estacionesClient = retrofit.create(EstacionesRestClient.class);

	public ServiceEstaciones() {

	}

	public boolean estacionarBicicleta(String idEstacion) throws ServiceAlquileresException {
		EstacionSinBicis response;
		try {
			System.out.println(estacionesClient.getEstacionSinBicis(idEstacion).execute());
			System.out.println();
			response = estacionesClient.getEstacionSinBicis(idEstacion).execute().body();
		} catch (IOException e) {
			throw new ServiceAlquileresException(e.getMessage());
		}
		return response.isHuecosLibres();
	}
}