package alquileres.rest;

import javax.ws.rs.core.Response;

import repository.RepositorioException;

public class TratamientoRepositorio {
	public Response toResponse(RepositorioException arg0) {
		return Response.status(Response
				.Status.INTERNAL_SERVER_ERROR)
				.entity(arg0.getMessage()).build();
	}
}
