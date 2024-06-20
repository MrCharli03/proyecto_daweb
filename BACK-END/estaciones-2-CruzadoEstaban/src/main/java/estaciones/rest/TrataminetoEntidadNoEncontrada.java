package estaciones.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import repository.EntidadNoEncontrada;

@ControllerAdvice
public class TrataminetoEntidadNoEncontrada {
	
	@ExceptionHandler(EntidadNoEncontrada.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.NOT_FOUND)
	private RespuestaError handleGlobalExceptione(EntidadNoEncontrada ex) {
		return new RespuestaError("Not found", ex.getMessage());
	}
	
	private static class RespuestaError {
        private String estado;
        private String mensaje;

        public RespuestaError(String estado, String mensaje) {
            this.estado = estado;
            this.mensaje = mensaje;
        }

        // Getters necesarios para la serialización a JSON
        public String getEstado() {
            return estado;
        }

        public String getMensaje() {
            return mensaje;
        }
    }
	
}
