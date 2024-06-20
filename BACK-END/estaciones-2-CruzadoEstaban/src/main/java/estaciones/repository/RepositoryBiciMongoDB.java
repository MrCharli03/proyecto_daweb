package estaciones.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import estaciones.persistencia.BiciPersistencia;

public interface RepositoryBiciMongoDB extends RepositoryBici, MongoRepository<BiciPersistencia, String> {
	
}
