package pasarela.security.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.context.annotation.ComponentScan;

import pasarela.dto.UsuarioRegistradoDTO;

@ComponentScan
public interface IServiceAutenticacion {
	
	 public String authenticate(UsuarioRegistradoDTO usuario) throws IOException;
	 
	 public Map<String, Object> authenticateWithGithub(String code) throws ServiceException, IOException;
	
}
