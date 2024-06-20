package alquileres.services;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import alquileres.modelo.Alquiler;
import alquileres.modelo.Reserva;
import alquileres.modelo.Usuario;
import alquileres.persistencia.jpa.UsuarioEntidadJPA;
import alquileres.rabbitmq.AlquileresEventHandler;
import alquileres.rabbitmq.IServicioEventos;
import alquileres.repository.RepositoryMapeadores;
import repository.EntidadNoEncontrada;
import repository.FactoryRepository;
import repository.RepositorioException;
import repository.Repository;
import services.FactoriaServicios;
import services.ServiceAlquileresException;

public class ServiceAlquileres implements IServiceAlquileres {

	private Repository<UsuarioEntidadJPA, String> repositorioUsuario = FactoryRepository
			.getRepository(UsuarioEntidadJPA.class);

	private ServiceEstaciones servicioEstaciones = new ServiceEstaciones();
	private IServicioTiempo tiempo = FactoriaServicios.getServicio(IServicioTiempo.class);
	private IServicioEventos eventos = FactoriaServicios.getServicio(IServicioEventos.class);

	private RepositoryMapeadores repositorioMapeadores = new RepositoryMapeadores();

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

	public ServiceAlquileres() {

		scheduler.scheduleAtFixedRate(() -> {
			try {
				verificarReservas();
			} catch (RepositorioException e) {
				e.printStackTrace();
			}
		}, 0, 30, TimeUnit.SECONDS);

		String cola = "citybike-alquileres";
		String enrutamiento = "citybike.estaciones.bicicleta-desactivada";
		try {
			eventos.subscrirEvento(cola, enrutamiento, new AlquileresEventHandler(this));
		} catch (IOException | TimeoutException e) {
			e.printStackTrace();
		}

	}

	@Override
	public void reservar(String idUsuario, String idBicicleta)
			throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		if (idUsuario == null || idUsuario.isEmpty())
			throw new IllegalArgumentException("id de la Usuario: no debe ser nulo ni vacio");
		if (idBicicleta == null || idBicicleta.isEmpty())
			throw new IllegalArgumentException("id de la Bicicleta: no debe ser nulo ni vacio");

		// Intenta obtener el usuario del repositorio
		UsuarioEntidadJPA usuarioJPA = null;
		Usuario usuario = null;
		try {
			usuarioJPA = repositorioUsuario.getById(idUsuario);
			usuario = repositorioMapeadores.usuarioEntidadJpaToModelo(usuarioJPA);
		} catch (EntidadNoEncontrada e) {
			usuario = darAltaUsuario(idUsuario);
		}

		List<Usuario> usuarios = new LinkedList<Usuario>();
		List<UsuarioEntidadJPA> usuariosJPA = repositorioUsuario.getAll();
		for (UsuarioEntidadJPA user : usuariosJPA) {
			usuarios.add(repositorioMapeadores.usuarioEntidadJpaToModelo(user));
		}

		for (Usuario u : usuarios) {
			Reserva activa = u.reservaActiva();
			Alquiler activo = u.alquilerActivo();
			if (activa != null && activa.getIdBicicleta().equals(idBicicleta))
				throw new ServiceAlquileresException("Esta bicicleta ya está reservada.");
			if (activo != null && activo.getIdBicicleta().equals(idBicicleta))
				throw new ServiceAlquileresException("Esta bicicleta está alquilada.");
		}

		if (usuario.reservaActiva() != null || usuario.alquilerActivo() != null || usuario.bloqueado()
				|| usuario.superaTiempo()) {
			System.out.println("No se puede realizar la reserva.");
			throw new IllegalArgumentException(
					"No se puede realizar la reserva porque ya tienes una reserva/alquiler activo, estás bloqueado o has superado el tiempo de uso diario/semanal.");
		}

		LocalDateTime caducidad = tiempo.now().plusMinutes(30);
		Reserva reserva = new Reserva(idBicicleta, tiempo.now(), caducidad);
		usuario.agregarReserva(reserva);

		usuarioJPA = repositorioMapeadores.usuarioModeloToEntidadJpa(usuario);
		repositorioUsuario.update(usuarioJPA);

		System.out.println("Reserva realizada con éxito.");

		String enrutamiento = "citybike.alquileres.bicicleta-reservada";
		String mensaje = "Reservada la bicicleta: " + idBicicleta + ", hora: " + tiempo.now();

		try {
			eventos.publicarEvento(enrutamiento, mensaje);
		} catch (IOException | TimeoutException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void confirmarReserva(String idUsuario)
			throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		if (idUsuario == null || idUsuario.isEmpty())
			throw new IllegalArgumentException("id de la Usuario: no debe ser nulo ni vacio");

		// Intenta obtener el usuario del repositorio
		UsuarioEntidadJPA usuarioJPA = null;
		Usuario usuario = null;
		try {
			usuarioJPA = repositorioUsuario.getById(idUsuario);
			usuario = repositorioMapeadores.usuarioEntidadJpaToModelo(usuarioJPA);
		} catch (EntidadNoEncontrada e) {
			usuario = darAltaUsuario(idUsuario);
		}

		Reserva reservaActiva = usuario.reservaActiva();
		if (reservaActiva == null) {
			System.out.println("No hay reserva activa para confirmar.");
			throw new IllegalArgumentException("No hay reserva activa para confirmar.");
		}

		usuario.getReservas().remove(reservaActiva);
		System.out.println("Reserva confirmada con éxito.");

		usuarioJPA = repositorioMapeadores.usuarioModeloToEntidadJpa(usuario);
		repositorioUsuario.update(usuarioJPA);

		alquilar(idUsuario, reservaActiva.getIdBicicleta());
	}

	@Override
	public void alquilar(String idUsuario, String idBicicleta)
			throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		if (idUsuario == null || idUsuario.isEmpty())
			throw new IllegalArgumentException("id de la Usuario: no debe ser nulo ni vacio");
		if (idBicicleta == null || idBicicleta.isEmpty())
			throw new IllegalArgumentException("id de la Bicicleta: no debe ser nulo ni vacio");

		// Intenta obtener el usuario del repositorio
		UsuarioEntidadJPA usuarioJPA = null;
		Usuario usuario = null;
		try {
			usuarioJPA = repositorioUsuario.getById(idUsuario);
			usuario = repositorioMapeadores.usuarioEntidadJpaToModelo(usuarioJPA);
		} catch (EntidadNoEncontrada e) {
			usuario = darAltaUsuario(idUsuario);
		}

		List<Usuario> usuarios = new LinkedList<Usuario>();
		List<UsuarioEntidadJPA> usuariosJPA = repositorioUsuario.getAll();
		for (UsuarioEntidadJPA user : usuariosJPA) {
			usuarios.add(repositorioMapeadores.usuarioEntidadJpaToModelo(user));
		}

		for (Usuario u : usuarios) {
			Reserva activa = u.reservaActiva();
			Alquiler activo = u.alquilerActivo();
			if (activa != null && activa.getIdBicicleta().equals(idBicicleta))
				throw new ServiceAlquileresException("Esta bicicleta ya está reservada.");
			if (activo != null && activo.getIdBicicleta().equals(idBicicleta))
				throw new ServiceAlquileresException("Esta bicicleta está alquilada.");
		}

		if (usuario.reservaActiva() != null || usuario.alquilerActivo() != null || usuario.bloqueado()
				|| usuario.superaTiempo()) {
			// No permitir el alquiler
			throw new IllegalArgumentException("No se puede realizar el alquiler.");
		}

		Alquiler alquiler = new Alquiler(idBicicleta, tiempo.now(), null);
		usuario.agregarAlquiler(alquiler);

		usuarioJPA = repositorioMapeadores.usuarioModeloToEntidadJpa(usuario);
		repositorioUsuario.update(usuarioJPA);

		System.out.println("Alquiler realizado con éxito.");

		String enrutamiento = "citybike.alquileres.bicicleta-alquilada";
		String mensaje = "Alquilada la bicicleta: " + idBicicleta + ", hora: " + tiempo.now();

		try {
			eventos.publicarEvento(enrutamiento, mensaje);
		} catch (IOException | TimeoutException e) {
			e.printStackTrace();
		}
	}

	@Override
	public Usuario historialUsuario(String idUsuario) throws RepositorioException, EntidadNoEncontrada {
		if (idUsuario == null || idUsuario.isEmpty())
			throw new IllegalArgumentException("id de la Usuario: no debe ser nulo ni vacio");

		// Intenta obtener el usuario del repositorio
		UsuarioEntidadJPA usuarioJPA = repositorioUsuario.getById(idUsuario);
		if (usuarioJPA == null)
			return null;
		Usuario usuario = repositorioMapeadores.usuarioEntidadJpaToModelo(usuarioJPA);

		return usuario;
	}

	@Override
	public void dejarBicicleta(String idUsuario, String idEstacion)
			throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		if (idUsuario == null || idUsuario.isEmpty())
			throw new IllegalArgumentException("id de la Usuario: no debe ser nulo ni vacio");

		// Intenta obtener el usuario del repositorio
		UsuarioEntidadJPA usuarioJPA = null;
		Usuario usuario = null;
		try {
			usuarioJPA = repositorioUsuario.getById(idUsuario);
			usuario = repositorioMapeadores.usuarioEntidadJpaToModelo(usuarioJPA);
		} catch (EntidadNoEncontrada e) {
			usuario = darAltaUsuario(idUsuario);
		}

		if (usuario.alquilerActivo() == null) {
			// No hay alquiler activo o la estación no tiene hueco disponible
			throw new IllegalArgumentException("Este usuario no tiene un alquiler activo.");
		}

		String idBici = usuario.alquilerActivo().getIdBicicleta();
		boolean hueco = servicioEstaciones.estacionarBicicleta(idEstacion);

		if (!hueco) {
			// No hay alquiler activo o la estación no tiene hueco disponible
			throw new ServiceAlquileresException("No hay hueco en la estación para dejar la bici.");
		}

		usuario.alquilerActivo().setFin(tiempo.now());

		usuarioJPA = repositorioMapeadores.usuarioModeloToEntidadJpa(usuario);
		repositorioUsuario.update(usuarioJPA);

		System.out.println("Bicicleta dejada en la estación con éxito.");

		String enrutamiento = "citybike.alquileres.bicicleta-alquiler-concluido";
		String mensaje = "Termina el alquiler de la bici: " + idBici + ", estacionada en la estación: " + idEstacion;

		try {
			eventos.publicarEvento(enrutamiento, mensaje);
		} catch (IOException | TimeoutException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void liberarBloqueo(String idUsuario) throws RepositorioException, EntidadNoEncontrada {
		if (idUsuario == null || idUsuario.isEmpty())
			throw new IllegalArgumentException("id de la Usuario: no debe ser nulo ni vacio");

		// Intenta obtener el usuario del repositorio
		UsuarioEntidadJPA usuarioJPA = null;
		Usuario usuario = null;
		try {
			usuarioJPA = repositorioUsuario.getById(idUsuario);
			usuario = repositorioMapeadores.usuarioEntidadJpaToModelo(usuarioJPA);
		} catch (EntidadNoEncontrada e) {
			usuario = darAltaUsuario(idUsuario);
		}

		if (!usuario.bloqueado()) {
			throw new IllegalArgumentException("El usuario no está bloqueado.");
		}

		LinkedList<Reserva> reservas = usuario.getReservas();
		Iterator<Reserva> iterator = reservas.iterator();

		while (iterator.hasNext()) {
			Reserva r = iterator.next();
			if (r.isCaducada()) {
				iterator.remove(); // Elimina el elemento actual de la lista
			}
		}

		usuario.setReservas(reservas); // Actualiza la lista de reservas del usuario con la lista filtrada

		usuarioJPA = repositorioMapeadores.usuarioModeloToEntidadJpa(usuario);
		repositorioUsuario.update(usuarioJPA);

		System.out.println("Reservas caducadas eliminadas.");
	}

	public Usuario darAltaUsuario(String id) throws RepositorioException {
		UsuarioEntidadJPA usuario = new UsuarioEntidadJPA(id);
		repositorioUsuario.add(usuario);
		return repositorioMapeadores.usuarioEntidadJpaToModelo(usuario);
	}

	public void setRepositorioUsuario(Repository<UsuarioEntidadJPA, String> repositorioUsuario) {
		this.repositorioUsuario = repositorioUsuario;
	}

	public void setServicioEstaciones(ServiceEstaciones servicioEstaciones2) {
		this.servicioEstaciones = servicioEstaciones2;
	}

	@Override
	public void eliminarReservasActivasDeBici(String idBici) throws RepositorioException, EntidadNoEncontrada {

		List<Usuario> usuarios = new LinkedList<Usuario>();

		for (UsuarioEntidadJPA usuarioJPA : repositorioUsuario.getAll()) {
			usuarios.add(repositorioMapeadores.usuarioEntidadJpaToModelo(usuarioJPA));
		}

		for (Usuario usuario : usuarios) {
			for (Reserva reserva : usuario.getReservas()) {
				if (reserva.activa() && reserva.getIdBicicleta().equals(idBici))
					usuario.getReservas().remove(reserva);
			}
			UsuarioEntidadJPA usuarioJPA = repositorioMapeadores.usuarioModeloToEntidadJpa(usuario);
			repositorioUsuario.update(usuarioJPA);
		}

	}

	private void verificarReservas() throws RepositorioException {
		List<Usuario> usuarios = new LinkedList<Usuario>();
		List<UsuarioEntidadJPA> usuariosJPA = repositorioUsuario.getAll();
		for (UsuarioEntidadJPA user : usuariosJPA) {
			usuarios.add(repositorioMapeadores.usuarioEntidadJpaToModelo(user));
		}

		for (Usuario u : usuarios) {
			for (Reserva reserva : u.getReservas()) {
				if (reserva.isCaducada()) {
					expirarReserva(usuarios, reserva.getIdBicicleta());
				}
			}
		}
	}

	private void expirarReserva(List<Usuario> usuarios, String idBicicleta) {
		boolean flag = true;
		for (Usuario u : usuarios) {
			Reserva activa = u.reservaActiva();
			Alquiler activo = u.alquilerActivo();
			if (activa != null || activo != null) {
				if (activa.getIdBicicleta().equals(idBicicleta) || activo.getIdBicicleta().equals(idBicicleta)) {
					flag = false;
				}
			}
		}

		if (flag) {
			String enrutamiento = "citybike.alquileres.reserva-caducada";
			String mensaje = "Caduca la reserva de la bici: " + idBicicleta;

			try {
				eventos.publicarEvento(enrutamiento, mensaje);
			} catch (IOException | TimeoutException e) {
				e.printStackTrace();
			}
		}
	}
}
