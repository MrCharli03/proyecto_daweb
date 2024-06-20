package pasarela.rest;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pasarela.dto.UsuarioRegistradoDTO;
import pasarela.security.services.ServiceAutenticacion;

@RestController
@RequestMapping("/auth")
public class PasarelaController {

	@Autowired
	private ServiceAutenticacion authenticationService;

	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody UsuarioRegistradoDTO usuario) throws IOException {
		String jwt = authenticationService.authenticate(usuario);
		return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(jwt);
	}

	/*//TODO eliminar
	@PostMapping("/auth/oauth2")
	public ResponseEntity<String> oauth2(@RequestParam("code") String code) {
		String jwt = authenticationService.authenticateWithGithub(code);
		return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(jwt);
	}*/
}
