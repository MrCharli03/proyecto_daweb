package estaciones.rest;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import estaciones.dto.AltaBiciDTO;
import estaciones.dto.AltaEstacionDTO;
import estaciones.dto.BiciDTO;
import estaciones.dto.EstacionDTO;
import estaciones.dto.EstacionSinBicis;
import estaciones.modelo.Bici;
import estaciones.persistencia.BiciPersistencia;
import estaciones.repository.RepositoryMapeadores;
import estaciones.services.IServicesEstaciones;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import repository.EntidadNoEncontrada;
import repository.RepositorioException;
import services.ServiceException;

@RestController
@RequestMapping("/estaciones")
@Tag(name = "Estaciones", description = "Aplicación de estaciones")
public class EstacionesController {

	private IServicesEstaciones servicioEstaciones;
	private RepositoryMapeadores repositorioManejadores = new RepositoryMapeadores();

	@Autowired
	private PagedResourcesAssembler<BiciDTO> biciPagedResourcesAssembler;

	@Autowired
	private PagedResourcesAssembler<EstacionDTO> estacionPagedResourcesAssembler;

	@Autowired
	public EstacionesController(IServicesEstaciones servicioEstaciones) {
		this.servicioEstaciones = servicioEstaciones;
	}

	// http://localhost:8080/estaciones/estacionesBicicletas
	@Operation(summary = "Alta estacion", description = "El gestor da de alta una estacion")
	@PostMapping("/estacionesBicicletas")
	public ResponseEntity<Void> altaEstacion(@RequestBody AltaEstacionDTO altaEstacionDTO) {
		servicioEstaciones.altaEstacion(altaEstacionDTO.getNombre(), altaEstacionDTO.getNumPuestos(),
				altaEstacionDTO.getCodPostal(), altaEstacionDTO.getLat(), altaEstacionDTO.getLng());
		return ResponseEntity.created(null).build();
	}

	// http://localhost:8080/estaciones/bicicletas
	@Operation(summary = "Alta bici", description = "El gestor da de alta una bici")
	@PostMapping("/bicicletas")
	public ResponseEntity<Void> altaBici(@RequestBody AltaBiciDTO altaBiciDTO)
			throws ServiceException, RepositorioException, EntidadNoEncontrada {
		servicioEstaciones.altaBici(altaBiciDTO.getModelo(), altaBiciDTO.getIdEstacion());
		return ResponseEntity.created(null).build();
	}

	// http://localhost:8080/estaciones/bicicletas/1
	@Operation(summary = "Baja bici", description = "El gestor da de baja una bici")
	@PostMapping("/bicicletas/{idBici}")
	public ResponseEntity<Void> bajaBici(@PathVariable String idBici, @RequestParam String motivo)
			throws ServiceException, RepositorioException, EntidadNoEncontrada {
		servicioEstaciones.bajaBici(idBici, motivo);
		repositorioManejadores.biciModeloToDTO(servicioEstaciones.getBici(idBici));
		return ResponseEntity.created(null).build();
	}

	// http://localhost:8080/estaciones/{idEstacion}/bicicletas/listado
	@Operation(summary = "Gestor obtener bicis", description = "El gestor obtiene una lista de todas las bicis de una estacion y las que puede dar de baja")
	@GetMapping("/{idEstacion}/bicicletas/listado")
	public ResponseEntity<PagedModel<EntityModel<BiciDTO>>> getListadoBiciEstacionGestor(
			@PathVariable String idEstacion, @RequestParam int page, @RequestParam Integer size,
			@RequestParam String motivo) throws EntidadNoEncontrada {
		PageRequest paginacion;
		if (size != null && size == -1) { // Si size es -1, obtiene todas las estaciones
			paginacion = PageRequest.of(page, Integer.MAX_VALUE, Sort.by("id").ascending());
		} else { // Si size no es -1, aplica paginación normal
			paginacion = PageRequest.of(page, size, Sort.by("id").ascending());
		}

		Page<BiciDTO> resultado1 = this.servicioEstaciones.getBicis(idEstacion, paginacion).map(bici -> {
			BiciDTO dto = repositorioManejadores.biciModeloToDTO(bici);
			return dto;
		});

		return ResponseEntity.ok(this.biciPagedResourcesAssembler.toModel(resultado1, bici -> {
			EntityModel<BiciDTO> model = EntityModel.of(bici);
			try {
				model.add(WebMvcLinkBuilder
						.linkTo(WebMvcLinkBuilder.methodOn(EstacionesController.class).bajaBici(bici.getId(), motivo))
						.withRel("bajaBici"));
				model.add(WebMvcLinkBuilder
						.linkTo(WebMvcLinkBuilder.methodOn(EstacionesController.class).getBici(bici.getId()))
						.withSelfRel());
			} catch (Exception e) {
				e.printStackTrace();
			}
			return model;
		}));
	}

	// http://localhost:8080/estaciones/listado
	@Operation(summary = "Obtener estaciones", description = "Obtiene una lista de todas las estaciones")
	@GetMapping("/listado")
	public ResponseEntity<PagedModel<EntityModel<EstacionDTO>>> getEstaciones(
			@RequestParam(required = false) String nombre, @RequestParam(required = false) String codPostal,
			@RequestParam(required = false) Integer numPuestos, @RequestParam int page,
			@RequestParam(required = false) Integer size) throws RepositorioException {
		PageRequest paginacion;
		if (size != null && size == -1) { // Si size es -1, obtiene todas las estaciones
			paginacion = PageRequest.of(page, Integer.MAX_VALUE, Sort.by("id").ascending());
		} else { // Si size no es -1, aplica paginación normal
			paginacion = PageRequest.of(page, size, Sort.by("id").ascending());
		}

		Page<EstacionDTO> resultado1 = this.servicioEstaciones.getEstaciones(nombre, codPostal, numPuestos, paginacion).map(estacion -> {
			EstacionDTO dto = repositorioManejadores.estacionModeloToDTO(estacion);
			return dto;
		});

		return ResponseEntity.ok(this.estacionPagedResourcesAssembler.toModel(resultado1, estacion -> {
			EntityModel<EstacionDTO> model = EntityModel.of(estacion);
			try {
				model.add(WebMvcLinkBuilder
						.linkTo(WebMvcLinkBuilder.methodOn(EstacionesController.class).getEstacion(estacion.getId()))
						.withSelfRel());
			} catch (Exception e) {
				e.printStackTrace();
			}
			return model;
		}));
	}

	// http://localhost:8080/estaciones/1/noBicicletas
	@Operation(summary = "Obtener estacion sin bicis", description = "Obtiene la informacion de una estacion sin las bicicletas")
	@GetMapping(value = "/{idEstacion}/noBicicletas", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EstacionSinBicis> getEstacionSinBicis(@PathVariable String idEstacion)
			throws EntidadNoEncontrada, RepositorioException {
		EstacionSinBicis dto = servicioEstaciones.getInfoEstacion(idEstacion);
		return ResponseEntity.ok(dto);
	}

	// http://localhost:8080/estaciones/1/bicicletas
	@Operation(summary = "Obtener bicis disponibles", description = "Obtiene un listado de todas las bicis disponibles de una estacion")
	@GetMapping("/{idEstacion}/bicicletas")
	public ResponseEntity<PagedModel<EntityModel<BiciDTO>>> getListadoBiciEstacionDisponibles(
			@PathVariable String idEstacion, @RequestParam int page, @RequestParam(required = false) Integer size)
			throws EntidadNoEncontrada {
		PageRequest paginacion;
		if (size != null && size == -1) { // Si size es -1, obtiene todas las estaciones
			paginacion = PageRequest.of(page, Integer.MAX_VALUE, Sort.by("id").ascending());
		} else { // Si size no es -1, aplica paginación normal
			paginacion = PageRequest.of(page, size, Sort.by("id").ascending());
		}

		Page<BiciDTO> resultado1 = this.servicioEstaciones.getBicisDisponibles(idEstacion, paginacion).map(bici -> {
			BiciDTO dto = repositorioManejadores.biciModeloToDTO(bici);
			return dto;
		});

		return ResponseEntity.ok(this.biciPagedResourcesAssembler.toModel(resultado1, bici -> {
			EntityModel<BiciDTO> model = EntityModel.of(bici);
			try {
				model.add(WebMvcLinkBuilder
						.linkTo(WebMvcLinkBuilder.methodOn(EstacionesController.class).getBici(bici.getId()))
						.withSelfRel());
			} catch (Exception e) {
				e.printStackTrace();
			}
			return model;
		}));
	}

	// http://localhost:8080/estaciones/2/bicicletas/1
	@Operation(summary = "Estacionar bici", description = "Se estaciona una bici en la estacion")
	@PostMapping("/{idEstacion}/bicicletas/{idBici}")
	public ResponseEntity<Void> estacionarBicicleta(@PathVariable String idEstacion, @PathVariable String idBici)
			throws ServiceException, EntidadNoEncontrada {
		servicioEstaciones.estacionarBicicleta(idBici, idEstacion);
		return ResponseEntity.created(null).build();
	}

	// Funciones auxiliares

	// http://localhost:8080/estaciones/1
	@Operation(summary = "Obtener estacion", description = "Obtiene la estacion por su id")
	@GetMapping("/{idEstacion}")
	public ResponseEntity<EstacionDTO> getEstacion(@PathVariable String idEstacion)
			throws RepositorioException, EntidadNoEncontrada {
		EstacionDTO dto = repositorioManejadores.estacionModeloToDTO(servicioEstaciones.getEstacion(idEstacion));
		return ResponseEntity.ok(dto);
	}

	// http://localhost:8080/estaciones/bicicletas/1
	@Operation(summary = "Obtener bici", description = "Obtiene la bici por su id")
	@GetMapping("/bicicletas/{idBici}")
	public ResponseEntity<BiciDTO> getBici(@PathVariable String idBici) throws EntidadNoEncontrada {
		BiciDTO dto = repositorioManejadores.biciModeloToDTO(this.servicioEstaciones.getBici(idBici));
		return ResponseEntity.ok(dto);
	}

	@Operation(summary = "Tiene huecos libres", description = "Devuelve un booleano para saber si una estacion tiene huecos libres")
	@GetMapping(value = "/{idEstacion}/huecos", produces = MediaType.APPLICATION_JSON_VALUE)
	public boolean isHuecosLibres(@PathVariable String idEstacion) throws EntidadNoEncontrada {
		EstacionSinBicis dto = servicioEstaciones.getInfoEstacion(idEstacion);
		return dto.isHuecosLibres();
	}

	// Método para modificar una estación
	@Operation(summary = "Modificar estacion", description = "El gestor modifica una estacion existente")
	@PreAuthorize("hasAuthority('Gestor')")
	@PostMapping("/{idEstacion}")
	public ResponseEntity<Void> modificarEstacion(@PathVariable String idEstacion,
			@RequestBody AltaEstacionDTO altaEstacionDTO) throws EntidadNoEncontrada, ServiceException {
		servicioEstaciones.modificarEstacion(idEstacion, altaEstacionDTO.getNombre(), altaEstacionDTO.getNumPuestos(),
				altaEstacionDTO.getCodPostal(), altaEstacionDTO.getLat(), altaEstacionDTO.getLng());
		return ResponseEntity.ok().build();
	}

	// Método para eliminar una estación
	@Operation(summary = "Eliminar estacion", description = "El gestor elimina una estacion existente")
	@PreAuthorize("hasAuthority('Gestor')")
	@DeleteMapping("/{idEstacion}")
	public ResponseEntity<Void> eliminarEstacion(@PathVariable String idEstacion)
			throws EntidadNoEncontrada, ServiceException {
		servicioEstaciones.eliminarEstacion(idEstacion);
		return ResponseEntity.noContent().build();
	}
	
	@Operation(summary = "Obtener todas las bicis", description = "Obtiene la bici por su id")
	@GetMapping("/bicicletas")
	public ResponseEntity<List<BiciDTO>> getAllBicis() throws EntidadNoEncontrada {
		List<BiciDTO> bicisDTO = new LinkedList<BiciDTO>();
		List<Bici> bicis = servicioEstaciones.getAllBicis();
		
		for (Bici bici : bicis) {
			bicisDTO.add(repositorioManejadores.biciModeloToDTO(bici));
		}
		return ResponseEntity.ok(bicisDTO);
	}
}