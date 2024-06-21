package pasarela.security;

import java.io.IOException;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ldap.embedded.EmbeddedLdapProperties.Credential;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import pasarela.security.services.IServiceAutenticacion;
import pasarela.security.services.ServiceException;
import retrofit.UsuariosRestClient;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

@Component
public class SecuritySuccesHandler implements AuthenticationSuccessHandler {

    @Autowired
    private IServiceAutenticacion servicioAutenticacion;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        DefaultOAuth2User usuario = (DefaultOAuth2User) authentication.getPrincipal();

        try {
            // Código del usuario de github
            Map<String, Object> claims = servicioAutenticacion.authenticateWithGithub(usuario.getName());

            Date caducidad = Date.from(Instant.now().plusSeconds(7200));
            String token = Jwts.builder()
                    .setClaims(claims)
                    .signWith(SignatureAlgorithm.HS256, "secreto")
                    .setExpiration(caducidad)
                    .compact();

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> authResult = new HashMap<>();
            authResult.put("token", token);
            authResult.put("identificador del usuario", claims.get("dni"));
            authResult.put("nombre completo del usuario", claims.get("nombreCompleto"));
            authResult.put("username", claims.get("username"));
            authResult.put("rol", claims.get("rol"));

            String jsonResponse = objectMapper.writeValueAsString(authResult);

            // Redirigir con los datos de autenticación en la URL codificados en Base64
            String base64JsonResponse = Base64.getEncoder().encodeToString(jsonResponse.getBytes());
            response.sendRedirect("http://localhost:3000/callback/github?credenciales=" + base64JsonResponse);

        } catch (ServiceException e) {
            // Informamos de error 401
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().append(e.getMessage());
        } catch (IOException e) {
            // Informamos de error 500
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().append(e.getMessage());
        }
    }
}
