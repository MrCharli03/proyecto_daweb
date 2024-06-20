package estaciones.rest;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class TratamientoIllegalArgumentException {

	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseBody
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	private RespuestaError handleGlobalExceptione(IllegalArgumentException ex) {
		return new RespuestaError("Bad Request", ex.getMessage());
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
