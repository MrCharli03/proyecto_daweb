/*package alquileres.services;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import alquileres.mapeadores.MapeadorAlquiler;
import alquileres.mapeadores.MapeadorReserva;
import alquileres.mapeadores.MapeadorUsuario;
import alquileres.modelo.Alquiler;
import alquileres.modelo.Reserva;
import alquileres.modelo.Usuario;
import alquileres.persistencia.jpa.AlquilerEntidadJPA;
import alquileres.persistencia.jpa.ReservaEntidadJPA;
import alquileres.persistencia.jpa.UsuarioEntidadJPA;
import repository.EntidadNoEncontrada;
import repository.FactoryRepository;
import repository.RepositorioException;
import repository.Repository;
import services.FactoriaServicios;
import services.ServiceAlquileresException;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class AlquilerTest {

	private ServicioTiempo tiempo = (ServicioTiempo) FactoriaServicios.getServicio(IServicioTiempo.class);
	private ServiceAlquileres servicio = (ServiceAlquileres) FactoriaServicios.getServicio(IServiceAlquileres.class);
	private ServiceEstaciones servicioEstaciones = new ServiceEstaciones();

	Repository<UsuarioEntidadJPA, String> repositorioUsuario = FactoryRepository.getRepository(UsuarioEntidadJPA.class);

	@SuppressWarnings("unchecked")
	@Before
	public void setUp() {
		servicioEstaciones = Mockito.mock(ServiceEstaciones.class);
		repositorioUsuario = Mockito.mock(Repository.class);

		servicio.setRepositorioUsuario(repositorioUsuario);
		servicio.setServicioEstaciones(servicioEstaciones);

		tiempo.resetSystemTime();

	}

	@Test(expected = IllegalArgumentException.class)
	public void test01_ReservarWithNullUserId() throws RepositorioException, EntidadNoEncontrada {
		servicio.reservar(null, "bicicletaId");
	}

	@Test(expected = IllegalArgumentException.class)
	public void test02_ReservarWithEmptyUserId() throws RepositorioException, EntidadNoEncontrada {
		servicio.reservar("", "bicicletaId");
	}

	@Test(expected = IllegalArgumentException.class)
	public void test03_ReservarWithNullBicycleId() throws RepositorioException, EntidadNoEncontrada {
		servicio.reservar("userId", null);
	}

	@Test(expected = IllegalArgumentException.class)
	public void test04_ReservarWithEmptyBicycleId() throws RepositorioException, EntidadNoEncontrada {
		servicio.reservar("userId", "");
	}

	@Test
	public void test05_Reservar() throws RepositorioException, EntidadNoEncontrada {
		String idUsuario = "usuario1";
		String idBicicleta = "bicicleta1";
		UsuarioEntidadJPA mockUserEntity = new UsuarioEntidadJPA(idUsuario);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(mockUserEntity);

		// Capturar el argumento pasado al método update del repositorio
		ArgumentCaptor<UsuarioEntidadJPA> usuarioEntidadCaptor = ArgumentCaptor.forClass(UsuarioEntidadJPA.class);

		servicio.reservar(idUsuario, idBicicleta);

		// Verificar que el método update fue llamado con el objeto mockUserEntity
		verify(repositorioUsuario).update(usuarioEntidadCaptor.capture());

		// Obtener el objeto capturado
		UsuarioEntidadJPA usuarioActualizado = usuarioEntidadCaptor.getValue();

		System.out.println(usuarioActualizado);

		verify(repositorioUsuario, times(1)).update(any(UsuarioEntidadJPA.class));
		assertEquals(1, usuarioActualizado.getReservas().size());
	}

	@Test(expected = IllegalArgumentException.class)
	public void test06_ReservarFailedDueToActiveReservation() throws RepositorioException, EntidadNoEncontrada {
		// Arrange
		MapeadorUsuario mapUsuario = new MapeadorUsuario(new MapeadorAlquiler(), new MapeadorReserva());
		String userId = "userId";
		String bicycleId = "bicycleId";
		Usuario usuario = new Usuario();
		usuario.setId(userId);
		usuario.getReservas().add(new Reserva("otherBicycleId", tiempo.now().plusMinutes(10)));
		UsuarioEntidadJPA usuarioEntidadJPA = mapUsuario.modeloToEntidadJPA(usuario);

		when(repositorioUsuario.getById(userId)).thenReturn(usuarioEntidadJPA);

		// Act
		servicio.reservar(userId, bicycleId);
	}

	@Test(expected = IllegalArgumentException.class)
	public void test07_ConfirmarReservaWithNullUserId() throws RepositorioException, EntidadNoEncontrada {
		servicio.confirmarReserva(null);
	}

	@Test(expected = IllegalArgumentException.class)
	public void test08_ConfirmarReservaWithEmptyUserId() throws RepositorioException, EntidadNoEncontrada {
		servicio.confirmarReserva("");
	}

	@Test(expected = IllegalArgumentException.class)
	public void test09_ConfirmarReserva_SinReservaActiva_Failure() throws RepositorioException, EntidadNoEncontrada {
		// Arrange
		MapeadorUsuario mapUsuario = new MapeadorUsuario(new MapeadorAlquiler(), new MapeadorReserva());
		String userId = "userId";
		Usuario usuario = new Usuario();
		usuario.setId(userId);
		UsuarioEntidadJPA usuarioEntidadJPA = mapUsuario.modeloToEntidadJPA(usuario);

		when(repositorioUsuario.getById(userId)).thenReturn(usuarioEntidadJPA);

		// Llamada al método que queremos probar
		servicio.confirmarReserva(userId);
	}

	/*@Test
	public void test10_ConfirmarReserva() throws RepositorioException, EntidadNoEncontrada {
		UsuarioEntidadJPA usuarioJPA = new UsuarioEntidadJPA("1");
		String bicycleId = "bicycleId";
		usuarioJPA.getReservas().add(
				new ReservaEntidadJPA(bicycleId, tiempo.now(), tiempo.now().plusMinutes(30), usuarioJPA));
		when(repositorioUsuario.getById("1")).thenReturn(usuarioJPA);

		// Capturar el argumento pasado al método update del repositorio
		ArgumentCaptor<UsuarioEntidadJPA> usuarioEntidadCaptor = ArgumentCaptor.forClass(UsuarioEntidadJPA.class);

		// Llamada al método que queremos probar
		servicio.confirmarReserva("1");

		// Verificar que el método update fue llamado con el objeto mockUserEntity
		verify(repositorioUsuario).update(usuarioEntidadCaptor.capture());

		// Obtener el objeto capturado
		UsuarioEntidadJPA usuarioActualizado = usuarioEntidadCaptor.getValue();

		// Verificación de que se ha confirmado la reserva y se ha creado un alquiler
		assertNotNull(usuarioJPA.getAlquileres()); // Verifica que se ha creado un alquiler
		assertEquals(1, usuarioActualizado.getAlquileres().size());
		assertEquals(0, usuarioActualizado.getReservas().size());
	}

	@Test
	public void test11_Alquilar() throws RepositorioException, EntidadNoEncontrada {
		String idUsuario = "usuario1";
		String idBicicleta = "bicicleta1";
		UsuarioEntidadJPA mockUserEntity = new UsuarioEntidadJPA(idUsuario);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(mockUserEntity);

		// Capturar el argumento pasado al método update del repositorio
		ArgumentCaptor<UsuarioEntidadJPA> usuarioEntidadCaptor = ArgumentCaptor.forClass(UsuarioEntidadJPA.class);

		servicio.alquilar(idUsuario, idBicicleta);

		// Verificar que el método update fue llamado con el objeto mockUserEntity
		verify(repositorioUsuario).update(usuarioEntidadCaptor.capture());

		// Obtener el objeto capturado
		UsuarioEntidadJPA usuarioActualizado = usuarioEntidadCaptor.getValue();

		System.out.println(usuarioActualizado);

		verify(repositorioUsuario, times(1)).update(any(UsuarioEntidadJPA.class));
		assertEquals(1, usuarioActualizado.getAlquileres().size());
	}

	@Test(expected = IllegalArgumentException.class)
	public void test12_AlquilarFalse() throws RepositorioException, EntidadNoEncontrada {
		MapeadorUsuario mapUsuario = new MapeadorUsuario(new MapeadorAlquiler(), new MapeadorReserva());
		String idUsuario = "usuario1";
		String idBicicleta = "bicicleta1";
		Usuario usuario = new Usuario();
		usuario.setId(idUsuario);
		usuario.getAlquileres().add(new Alquiler(idBicicleta, tiempo.now(), null));
		UsuarioEntidadJPA usuarioEntidadJPA = mapUsuario.modeloToEntidadJPA(usuario);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(usuarioEntidadJPA);

		// Act
		servicio.reservar(idUsuario, idBicicleta);
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void test13_AlquilarWithNullUserId() throws RepositorioException, EntidadNoEncontrada {
		servicio.reservar(null, "bicicletaId");
	}

	@Test(expected = IllegalArgumentException.class)
	public void test14_AlquilarWithNullBicycleId() throws RepositorioException, EntidadNoEncontrada {
		servicio.reservar("usuarioId", null);
	}

	@Test
	public void test15_HistorialUsuario() throws RepositorioException, EntidadNoEncontrada {
		String idUsuario = "usuario1";

		UsuarioEntidadJPA mockUserEntity = new UsuarioEntidadJPA(idUsuario);
		ReservaEntidadJPA mockReserva = new ReservaEntidadJPA("B1", tiempo.now(),
				tiempo.now().plusMinutes(30), mockUserEntity);
		mockUserEntity.getReservas().add(mockReserva);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(mockUserEntity);

		Usuario usuario = servicio.historialUsuario(idUsuario);
		// System.out.println(usuario);
		assertNotNull(usuario);
	}

	@Test
	public void test16_HistorialUsuarioNula() throws RepositorioException, EntidadNoEncontrada {
		String idUsuario = "usuarioFalso";

		Usuario usuario = servicio.historialUsuario(idUsuario);
		assertNull(usuario);
	}

	@Test(expected = IllegalArgumentException.class)
	public void test17_HistorialUsuarioWithEmptyUserId() throws RepositorioException, EntidadNoEncontrada {
		servicio.historialUsuario("");
	}

	/*@Test
	public void test18_DejarBicicleta() throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		MapeadorUsuario mapUsuario = new MapeadorUsuario(new MapeadorAlquiler(), new MapeadorReserva());
		String idUsuario = "usuario3";
		String idBicicleta = "bicicleta5";
		String idEstacion = "E1";

		UsuarioEntidadJPA mockUserEntity = new UsuarioEntidadJPA(idUsuario);

		AlquilerEntidadJPA alquilerEntidadJPA = new AlquilerEntidadJPA(idBicicleta,
				tiempo.now().minusMinutes(20), null, mockUserEntity);
		
		mockUserEntity.getAlquileres().add(alquilerEntidadJPA);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(mockUserEntity);
		
		// Capturar el argumento pasado al método update del repositorio
		ArgumentCaptor<UsuarioEntidadJPA> usuarioEntidadCaptor = ArgumentCaptor.forClass(UsuarioEntidadJPA.class);

		servicio.dejarBicicleta(idUsuario, idEstacion);
		
		// Verificar que el método update fue llamado con el objeto mockUserEntity
		verify(repositorioUsuario).update(usuarioEntidadCaptor.capture());
		
		// Obtener el objeto capturado
		UsuarioEntidadJPA usuarioActualizado = usuarioEntidadCaptor.getValue();

		Usuario u = mapUsuario.entidadJPAToModelo(usuarioActualizado);
		
		System.out.println(u);
		
		assertNull(u.alquilerActivo());
	}

	@Test(expected = IllegalArgumentException.class)
	public void test19_DejarBicicletaFallo() throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		String idUsuario = "usuario7";
		String idBicicleta = "bicicleta4";
		String idEstacion = "E1";

		UsuarioEntidadJPA mockUserEntity = new UsuarioEntidadJPA(idUsuario);

		AlquilerEntidadJPA alquilerEntidadJPA = new AlquilerEntidadJPA(idBicicleta,
				tiempo.now().minusMinutes(20), tiempo.now(), mockUserEntity);
		mockUserEntity.getAlquileres().add(alquilerEntidadJPA);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(mockUserEntity);

		servicio.dejarBicicleta(idUsuario, idEstacion);
	}

	@Test(expected = IllegalArgumentException.class)
	public void test20_DejarBicicletaWithEmptyUserId() throws RepositorioException, EntidadNoEncontrada, ServiceAlquileresException {
		servicio.dejarBicicleta("", "E1");
	}

	@Test
	public void test21_LiberarBloqueo() throws RepositorioException, EntidadNoEncontrada {
		MapeadorUsuario mapUsuario = new MapeadorUsuario(new MapeadorAlquiler(), new MapeadorReserva());
		String idUsuario = "usuario1";

		UsuarioEntidadJPA mockUserEntity = new UsuarioEntidadJPA(idUsuario);
		
		ReservaEntidadJPA r = new ReservaEntidadJPA("bici1", tiempo.now().minusDays(2), tiempo.now().minusDays(1), mockUserEntity);
		mockUserEntity.getReservas().add(r);
		r = new ReservaEntidadJPA("bici2", tiempo.now().minusDays(2), tiempo.now().minusDays(1), mockUserEntity);
		mockUserEntity.getReservas().add(r);
		r = new ReservaEntidadJPA("bici3", tiempo.now().minusDays(2), tiempo.now().minusDays(1), mockUserEntity);
		mockUserEntity.getReservas().add(r);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(mockUserEntity);

		// Capturar el argumento pasado al método update del repositorio
		ArgumentCaptor<UsuarioEntidadJPA> usuarioEntidadCaptor = ArgumentCaptor.forClass(UsuarioEntidadJPA.class);
		
		servicio.liberarBloqueo(idUsuario);
		
		// Verificar que el método update fue llamado con el objeto mockUserEntity
		verify(repositorioUsuario).update(usuarioEntidadCaptor.capture());
		
		// Obtener el objeto capturado
		UsuarioEntidadJPA usuarioActualizado = usuarioEntidadCaptor.getValue();
		
		Usuario u = mapUsuario.entidadJPAToModelo(usuarioActualizado);

		assertEquals(u.getReservas().size(),0);
	}

	@Test(expected = IllegalArgumentException.class)
	public void test22_LiberarBloqueoWithEmptyUserId() throws RepositorioException, EntidadNoEncontrada {
		servicio.liberarBloqueo("");
	}
	
	@Test(expected = IllegalArgumentException.class)
	public void test23_LiberarBloqueoNoBloqueo() throws RepositorioException, EntidadNoEncontrada {
		String idUsuario = "usuario1";

		UsuarioEntidadJPA mockUserEntity = new UsuarioEntidadJPA(idUsuario);

		when(repositorioUsuario.getById(idUsuario)).thenReturn(mockUserEntity);

		servicio.liberarBloqueo(idUsuario);
	}
}*/
