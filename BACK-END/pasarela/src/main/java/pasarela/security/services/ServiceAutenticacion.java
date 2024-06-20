package pasarela.security.services;

import java.io.IOException;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import pasarela.dto.UsuarioRegistradoDTO;
import retrofit.UsuariosRestClient;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

@Service
public class ServiceAutenticacion implements IServiceAutenticacion {

	//String url = "http://usuarios-service:5076";
	// String url = "http://localhost:5076";

	private final UsuariosRestClient usuariosClient;
	
	@Autowired
	public ServiceAutenticacion(@Value("${RUTA_USUARIOS_URL:http://localhost:5076}") String usuariosServiceUrl) {

        Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(usuariosServiceUrl)
            .addConverterFactory(JacksonConverterFactory.create())
            .build();

        usuariosClient = retrofit.create(UsuariosRestClient.class);
    }

	@Override
	public String authenticate(UsuarioRegistradoDTO usuario) throws JsonProcessingException {
		if (usuario.getPassword() == null || usuario.getPassword() == "") {
			throw new IllegalArgumentException("contraseña: no debe ser nulo ni vacio");
		}

		ObjectMapper objectMapper = new ObjectMapper();
		String jsonResponse = "{}"; // JSON vacío por defecto

		try {
			// Intenta obtener la respuesta con las credenciales y parsearla
			Map<String, Object> credentialsResponse = usuariosClient.getCredenciales(usuario).execute().body();
			System.out.println(credentialsResponse);

			if (credentialsResponse != null && !credentialsResponse.isEmpty()) {
				Date expiration = Date.from(Instant.now().plusSeconds(7200));

				String token = Jwts.builder().setClaims(credentialsResponse)
						.signWith(SignatureAlgorithm.HS256, "secreto").setExpiration(expiration).compact();

				Map<String, Object> authResult = new HashMap<>();
				authResult.put("token", token);
				authResult.put("identificador del usuario", credentialsResponse.get("dni"));
				authResult.put("nombre completo del usuario", credentialsResponse.get("nombreCompleto"));
				authResult.put("username", credentialsResponse.get("username"));
				authResult.put("rol", credentialsResponse.get("rol"));

				jsonResponse = objectMapper.writeValueAsString(authResult);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		return jsonResponse;
	}

	@Override
	public Map<String, Object> authenticateWithGithub(String code) throws ServiceException, IOException {
		if (code == null || code.isEmpty()) {
			throw new IllegalArgumentException("code: no debe ser nulo ni vacio");
		}

		// ObjectMapper objectMapper = new ObjectMapper();
		// String jsonResponse = "{}"; // JSON vacío por defecto

		// Intenta obtener la respuesta con el oauth2 y parsearla
		Response<Map<String, Object>> credentialsResponse = usuariosClient.getUsuariosOAuth2(code).execute();

		if (!credentialsResponse.isSuccessful()) {
			throw new ServiceException("El usuario no está registrado.");
		}
		
		Map<String, Object> credentials = credentialsResponse.body();
		System.out.println(credentials);

		// jsonResponse = "{ No existe usuario con ese code }";

		return credentials; 
	}
}
