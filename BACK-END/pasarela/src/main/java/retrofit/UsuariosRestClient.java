package retrofit;

import java.util.Map;

import pasarela.dto.UsuarioRegistradoDTO;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface UsuariosRestClient {

	@POST("credenciales")
	Call<Map<String, Object>> getCredenciales(@Body UsuarioRegistradoDTO usuario);
	
	@GET("oauth2")
	Call<Map<String, Object>> getUsuariosOAuth2(@Query("oauth2Id") String oauth2Id);

	
}
