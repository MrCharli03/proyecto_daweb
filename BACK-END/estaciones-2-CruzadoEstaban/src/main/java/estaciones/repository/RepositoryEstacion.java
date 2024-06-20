package estaciones.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import estaciones.persistencia.EstacionPersistencia;

@NoRepositoryBean
public interface RepositoryEstacion extends CrudRepository<EstacionPersistencia, String> {

	Page<EstacionPersistencia> findAll(Pageable pageable);

	Page<EstacionPersistencia> findByNombreContainingIgnoreCaseAndCodPostalContainingIgnoreCaseAndNumPuestos(String nombre,
			String codPostal, Integer numPuestos, Pageable pageable);

	Page<EstacionPersistencia> findByNombreContainingIgnoreCaseAndCodPostalContainingIgnoreCase(String nombre, String codPostal,
			Pageable pageable);

	Page<EstacionPersistencia> findByNombreContainingIgnoreCaseAndNumPuestos(String nombre, Integer numPuestos,
			Pageable pageable);

	Page<EstacionPersistencia> findByCodPostalContainingIgnoreCaseAndNumPuestos(String codPostal, Integer numPuestos, Pageable pageable);

	Page<EstacionPersistencia> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

	Page<EstacionPersistencia> findByCodPostalContainingIgnoreCase(String codPostal, Pageable pageable);

	Page<EstacionPersistencia> findByNumPuestos(Integer numPuestos, Pageable pageable);
}
