package estaciones.services;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import estaciones.dto.EstacionSinBicis;
import estaciones.modelo.Bici;
import estaciones.modelo.Estacion;
import estaciones.modelo.EstadoBici;
import estaciones.persistencia.BiciPersistencia;
import estaciones.persistencia.EstacionPersistencia;
import estaciones.rabbitmq.PublicadorEventos;
import estaciones.repository.RepositoryBici;
import estaciones.repository.RepositoryEstacion;
import estaciones.repository.RepositoryMapeadores;
import repository.EntidadNoEncontrada;
import services.ServiceException;

@Service
public class ServiceEstaciones implements IServicesEstaciones {

	private RepositoryEstacion repositorioEstacion;
	private RepositoryBici repositorioBici;
	private PublicadorEventos eventos;

	@Autowired
	public ServiceEstaciones(RepositoryEstacion repositorioEstacion, RepositoryBici repositorioBici,
			PublicadorEventos eventos) {
		this.repositorioEstacion = repositorioEstacion;
		this.repositorioBici = repositorioBici;
		this.eventos = eventos;
	}

	private RepositoryMapeadores repositorioManejadores = new RepositoryMapeadores();

	public ServiceEstaciones() {

	}

	@Override
	public String altaEstacion(String nombre, int numPuestos, String codPostal, double lat, double lng) {

		if (nombre == null || nombre.isEmpty())
			throw new IllegalArgumentException("nombre: no debe ser nulo ni vacio");
		if (numPuestos < 3)
			throw new IllegalArgumentException("num_puestos: el valor mínimo es 3");
		if (codPostal == null || codPostal.isEmpty())
			throw new IllegalArgumentException("cod_postal: no debe ser nulo ni vacio");
		if (lat > 90 || lat < -90)
			throw new IllegalArgumentException("latitud: esta entre -90 y 90");
		if (lng > 180 || lat < -180)
			throw new IllegalArgumentException("longitud:  esta entre -180 y 180");

		Estacion estacion = new Estacion(nombre, numPuestos, codPostal, lat, lng);
		EstacionPersistencia estacionJPA = repositorioManejadores.estacionModeloToEntidadJpa(estacion);
		String idEstacion = repositorioEstacion.save(estacionJPA).getId();

		return idEstacion;
	}

	@Override
	public String altaBici(String modelo, String idEstacion) throws ServiceException, EntidadNoEncontrada {

		if (modelo == null || modelo.isEmpty())
			throw new IllegalArgumentException("modelo: no debe ser nulo ni vacio");
		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");

		Bici bici = new Bici(modelo, LocalDateTime.now());
		BiciPersistencia biciPersistencia = repositorioManejadores.biciModeloToEntidadJpa(bici);
		String idBici = repositorioBici.save(biciPersistencia).getId();

		estacionarBicicleta(idBici, idEstacion);

		return idBici;
	}

	@Override
	public void bajaBici(String idBici, String motivo) throws ServiceException, EntidadNoEncontrada {

		if (idBici == null || idBici.isEmpty())
			throw new IllegalArgumentException("id de la Bici: no debe ser nulo ni vacio");

		Bici bici = getBici(idBici);

		if (bici.getEstacionID() != null) {
			retirarBici(idBici);
		}

		bici.setEstacionID(null);
		bici.setMotivo(motivo);
		bici.setEstado(EstadoBici.NODISPONIBLE);
		bici.setFechaBaja(LocalDateTime.now());

		BiciPersistencia biciPersistencia = repositorioManejadores.biciModeloToEntidadJpa(bici);
		repositorioBici.save(biciPersistencia);

		String evento = "Baja de la bici: " + idBici;
		eventos.sendMessage(evento);
	}

	@Override
	public Page<Bici> getBicis(String idEstacion, Pageable pageable) throws EntidadNoEncontrada {

		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");

		Optional<EstacionPersistencia> estacionOpt = repositorioEstacion.findById(idEstacion);
		if (!estacionOpt.isPresent()) {
			throw new EntidadNoEncontrada("No existe una estacion con ID: " + idEstacion);
		}

		return this.repositorioBici.findAllByEstacionID(idEstacion, pageable).map((biciPersistencia) -> {
			Bici bici = repositorioManejadores.biciEntidadJpaToModelo(biciPersistencia);
			return bici;
		});

	}

	@Override
	public void retirarBici(String idBici) throws EntidadNoEncontrada, ServiceException {

		if (idBici == null || idBici.isEmpty())
			throw new IllegalArgumentException("id de la Bici: no debe ser nulo ni vacio");

		Bici bici = getBici(idBici);

		if (bici.getEstacionID() == null) {
			throw new ServiceException("No puedes retirar una Bici que no está estacionada");
		}

		Estacion estacion = getEstacion(bici.getEstacionID());
		estacion.retiraBici(bici.getId());

		EstacionPersistencia estacionPersistencia = repositorioManejadores.estacionModeloToEntidadJpa(estacion);
		repositorioEstacion.save(estacionPersistencia);

		bici.setEstacionID(null);
		bici.setEstado(EstadoBici.NODISPONIBLE);

		BiciPersistencia biciPersistencia = repositorioManejadores.biciModeloToEntidadJpa(bici);
		repositorioBici.save(biciPersistencia);
	}

	@Override
	public Page<Estacion> getEstaciones(String nombre, String codPostal, Integer numPuestos, Pageable pageable) {
		Page<EstacionPersistencia> estaciones;
		if (nombre != "" && codPostal != "" && numPuestos != null) {
			estaciones = this.repositorioEstacion
					.findByNombreContainingIgnoreCaseAndCodPostalContainingIgnoreCaseAndNumPuestos(nombre, codPostal,
							numPuestos, pageable);
		} else if (nombre != "" && codPostal != "") {
			estaciones = this.repositorioEstacion
					.findByNombreContainingIgnoreCaseAndCodPostalContainingIgnoreCase(nombre, codPostal, pageable);
		} else if (nombre != "" && numPuestos != null) {
			estaciones = this.repositorioEstacion.findByNombreContainingIgnoreCaseAndNumPuestos(nombre, numPuestos,
					pageable);
		} else if (codPostal != "" && numPuestos != null) {
			estaciones = this.repositorioEstacion.findByCodPostalContainingIgnoreCaseAndNumPuestos(codPostal,
					numPuestos, pageable);
		} else if (nombre != "") {
			estaciones = this.repositorioEstacion.findByNombreContainingIgnoreCase(nombre, pageable);
		} else if (codPostal != "") {
			estaciones = this.repositorioEstacion.findByCodPostalContainingIgnoreCase(codPostal, pageable);
		} else if (numPuestos != null) {
			estaciones = this.repositorioEstacion.findByNumPuestos(numPuestos, pageable);
		} else {
			estaciones = this.repositorioEstacion.findAll(pageable);
		}
		return estaciones.map((estacionPersistencia) -> {
			Estacion estacion = repositorioManejadores.estacionEntidadJpaToModelo(estacionPersistencia);
			return estacion;
		});
	}

	@Override
	public EstacionSinBicis getInfoEstacion(String idEstacion) throws EntidadNoEncontrada {

		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");

		Estacion estacion = getEstacion(idEstacion);

		boolean huecosLibes = false;
		if (estacion.getNumPuestos() > 0)
			huecosLibes = true;
		EstacionSinBicis e = new EstacionSinBicis(estacion.getId(), estacion.getNombre(), estacion.getNumPuestos(),
				estacion.getCodPostal(), estacion.getLat(), estacion.getLng(), estacion.getFechaAlta().toString(),
				huecosLibes);

		return e;
	}

	@Override
	public Page<Bici> getBicisDisponibles(String idEstacion, Pageable pageable) throws EntidadNoEncontrada {

		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");

		Optional<EstacionPersistencia> estacionOpt = repositorioEstacion.findById(idEstacion);
		if (!estacionOpt.isPresent()) {
			throw new EntidadNoEncontrada("No existe una estacion con ID: " + idEstacion);
		}
		
        List<EstadoBici> estados = Arrays.asList(EstadoBici.DISPONIBLE, EstadoBici.RESERVADA);

		return this.repositorioBici.findAllByEstacionIDAndEstadoIn(idEstacion, estados, pageable)
				.map((biciPersistencia) -> {
					Bici bici = repositorioManejadores.biciEntidadJpaToModelo(biciPersistencia);
					return bici;
				});
	}

	@Override
	public void estacionarBicicleta(String idBici, String idEstacion) throws ServiceException, EntidadNoEncontrada {

		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");
		if (idBici == null || idBici.isEmpty())
			throw new IllegalArgumentException("id de la Bici: no debe ser nulo ni vacio");

		Estacion estacion = getEstacion(idEstacion);

		Bici bici = getBici(idBici);

		if (bici.getEstacionID() != null) {
			retirarBici(idBici);
		}

		if (estacion.getNumPuestos() == 0) {
			throw new ServiceException("La estacion está completa, no caben más bicis");
		}

		bici.setEstacionID(estacion.getId());
		bici.setEstado(EstadoBici.DISPONIBLE);
		bici.setMotivo(null);
		bici.setFechaBaja(null);
		estacion.estacionaBici(bici);

		BiciPersistencia biciPersistencia = repositorioManejadores.biciModeloToEntidadJpa(bici);
		repositorioBici.save(biciPersistencia);

		EstacionPersistencia estacionPersistencia = repositorioManejadores.estacionModeloToEntidadJpa(estacion);
		repositorioEstacion.save(estacionPersistencia);

	}

	@Override
	public Bici getBici(String idBici) throws EntidadNoEncontrada {

		if (idBici == null || idBici.isEmpty())
			throw new IllegalArgumentException("id de la Bici: no debe ser nulo ni vacio");

		Optional<BiciPersistencia> biciOpt = repositorioBici.findById(idBici);
		if (!biciOpt.isPresent()) {
			throw new EntidadNoEncontrada("No existe una bici con ID: " + idBici);
		}

		return repositorioManejadores.biciEntidadJpaToModelo(biciOpt.get());
	}

	@Override
	public Estacion getEstacion(String idEstacion) throws EntidadNoEncontrada {

		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");

		Optional<EstacionPersistencia> estacionOpt = repositorioEstacion.findById(idEstacion);
		if (!estacionOpt.isPresent()) {
			throw new EntidadNoEncontrada("No existe una estacion con ID: " + idEstacion);
		}

		return repositorioManejadores.estacionEntidadJpaToModelo(estacionOpt.get());
	}

	@Override
	public void modificarEstacion(String idEstacion, String nombre, int numPuestos, String codPostal, double lat,
			double lng) throws EntidadNoEncontrada, ServiceException {
		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");
		if (nombre == null || nombre.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");
		if (codPostal == null || codPostal.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");

		Estacion estacion = getEstacion(idEstacion);

		try {
			estacion.setNombre(nombre);
			estacion.setCodPostal(codPostal);
			estacion.setLat(lat);
			estacion.setLng(lng);
			if (numPuestos < 3) {
				estacion.setNumPuestos(3);
				throw new ServiceException(
						"El numero de puestos no puede ser menor de 3, se asignará por defecto el valor mínimo, valor actualizado de numPuestos: 3");
			} else {
				estacion.setNumPuestos(numPuestos);
			}
		} catch (ServiceException e) {
			System.out.println("Se produjo una ServiceException: " + e.getMessage());
		}

		EstacionPersistencia estacionPersistencia = repositorioManejadores.estacionModeloToEntidadJpa(estacion);
		repositorioEstacion.save(estacionPersistencia);
	}

	@Override
	public void eliminarEstacion(String idEstacion) throws EntidadNoEncontrada, ServiceException {
		if (idEstacion == null || idEstacion.isEmpty())
			throw new IllegalArgumentException("id de la Estacion: no debe ser nulo ni vacio");

		Estacion estacion = getEstacion(idEstacion);
		if (estacion.getBicis().size() > 0)
			throw new ServiceException("No se puede eliminar una estación que tenga bicis");

		repositorioEstacion.deleteById(idEstacion);
	}

	@Override
	public List<Bici> getAllBicis() {
		List<Bici> bicis = new LinkedList<Bici>();
		List<BiciPersistencia> bicisPersitencia = this.repositorioBici.findAll();

		for (BiciPersistencia biciP : bicisPersitencia) {
			bicis.add(repositorioManejadores.biciEntidadJpaToModelo(biciP));
		}
		return bicis;
	}

	@Override
	public void reservarBici(String idBici) throws EntidadNoEncontrada {
		if (idBici == null || idBici.isEmpty())
			throw new IllegalArgumentException("id de la Bici: no debe ser nulo ni vacio");

		Bici bici = getBici(idBici);
		bici.setEstado(EstadoBici.RESERVADA);

		BiciPersistencia biciPersistencia = repositorioManejadores.biciModeloToEntidadJpa(bici);
		repositorioBici.save(biciPersistencia);
	}

	@Override
	public void caducaReserva(String idBici) throws EntidadNoEncontrada {
		if (idBici == null || idBici.isEmpty())
			throw new IllegalArgumentException("id de la Bici: no debe ser nulo ni vacio");

		Bici bici = getBici(idBici);
		bici.setEstado(EstadoBici.DISPONIBLE);

		BiciPersistencia biciPersistencia = repositorioManejadores.biciModeloToEntidadJpa(bici);
		repositorioBici.save(biciPersistencia);
	}
}
