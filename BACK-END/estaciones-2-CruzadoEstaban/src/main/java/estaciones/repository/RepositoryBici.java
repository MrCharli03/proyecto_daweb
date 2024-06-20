package estaciones.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

import estaciones.modelo.EstadoBici;
import estaciones.persistencia.BiciPersistencia;
import estaciones.persistencia.EstacionPersistencia;

@NoRepositoryBean
public interface RepositoryBici extends CrudRepository<BiciPersistencia, String> {

	Page<BiciPersistencia> findAll(Pageable pageable);
	
	List<BiciPersistencia> findAll();

	Page<BiciPersistencia> findAllByEstacionID(String idEstacion, Pageable pageable);
	
	Page<BiciPersistencia> findAllByEstacionIDAndEstadoIn(String idEstacion, List<EstadoBici> estados,Pageable pageable);

}
