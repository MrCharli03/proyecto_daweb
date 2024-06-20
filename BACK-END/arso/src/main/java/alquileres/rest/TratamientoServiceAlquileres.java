package alquileres.rest;

import javax.ws.rs.core.Response;

import services.ServiceAlquileresException;

public class TratamientoServiceAlquileres {
	public Response toResponse(ServiceAlquileresException arg0) {
		return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(arg0.getMessage()).build();
	}
}
