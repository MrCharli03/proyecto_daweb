package alquileres.retrofit;

import alquileres.dtos.EstacionSinBicis;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface EstacionesRestClient {

	@GET("estaciones/{idEstacion}/noBicicletas")
	Call<EstacionSinBicis> getEstacionSinBicis(@Path("idEstacion") String idEstacion);
}