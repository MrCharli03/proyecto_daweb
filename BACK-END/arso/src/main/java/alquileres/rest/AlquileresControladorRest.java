package alquileres.rest;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import alquileres.dtos.UsuarioDTO;
import alquileres.rabbitmq.AlquileresEventHandler;
import alquileres.repository.RepositoryMapeadores;
import alquileres.services.IServiceAlquileres;
import repository.EntidadNoEncontrada;
import repository.RepositorioException;
import services.FactoriaServicios;
import services.ServiceAlquileresException;

@Path("alquileres")
public class AlquileresControladorRest {

	private IServiceAlquileres servicio = FactoriaServicios.getServicio(IServiceAlquileres.class);
	AlquileresEventHandler eventHandler = new AlquileresEventHandler(servicio);
	private RepositoryMapeadores repositorioMapeadores = new RepositoryMapeadores();

	@Context
	private UriInfo uriInfo;

	// curl http://localhost:8081/api/alquileres/usuarios/1
	@GET
	@Path("usuarios/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getHistorialUsuario(@PathParam("id") String id) throws EntidadNoEncontrada, RepositorioException {
		UsuarioDTO dto = repositorioMapeadores.usuarioModeloToDTO(servicio.historialUsuario(id));
		return Response.status(Response.Status.OK).entity(dto).build();
	}

	// 1era forma de hacer curl en post
	// curl -i -X POST --data "idUsuario=3&idBici=3"
	// http://localhost:8081/api/alquileres/reservas
	@POST
	@Path("/reservas")
	public Response reservar(@FormParam("idUsuario") String idUsuario, @FormParam("idBici") String idBici)
			throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		servicio.reservar(idUsuario, idBici);
		return Response.status(Response.Status.CREATED).build();
	}

	// 2º forma de hacer curl en post
	// curl -i -X POST
	// http://localhost:8081/api/alquileres/usuarios/4/bicicletas/5
	@POST
	@Path("/usuarios/{idUsuario}/bicicletas/{idBici}")
	public Response alquilar(@PathParam("idUsuario") String idUsuario, @PathParam("idBici") String idBici)
			throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		servicio.alquilar(idUsuario, idBici);
		return Response.status(Response.Status.CREATED).build();
	}

	// curl -i -X POST
	// http://localhost:8081/api/alquileres/usuarios/3
	@POST
	@Path("/usuarios/{id}")
	public Response confirmarReserva(@PathParam("id") String id) throws EntidadNoEncontrada, RepositorioException, ServiceAlquileresException {
		servicio.confirmarReserva(id);
		return Response.status(Response.Status.CREATED).build();
	}

	// curl -i -X PUT "Content-type: application/json"
	// http://localhost:8081/api/alquileres/usuarios/3/estaciones/E3
	@PUT
	@Path("/usuarios/{idU}/estaciones/{idE}")
	public Response dejarBici(@PathParam("idU") String idU, @PathParam("idE") String idE)
			throws EntidadNoEncontrada, RepositorioException, ServiceAlquileresException {
		servicio.dejarBicicleta(idU, idE);
		return Response.status(Response.Status.NO_CONTENT).build();
	}

	// curl -i -X PUT "Content-type: application/json"
	// http://localhost:8081/api/alquileres/usuarios/3
	@PUT
	@Path("/usuarios/{id}")
	public Response liberaBloqueo(@PathParam("id") String id) throws RepositorioException, EntidadNoEncontrada {
		servicio.liberarBloqueo(id);
		return Response.status(Response.Status.NO_CONTENT).build();

	}

}
