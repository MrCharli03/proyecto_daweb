package estaciones.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import estaciones.persistencia.EstacionPersistencia;

public interface RepositoryEstacionMongoDB extends RepositoryEstacion, MongoRepository<EstacionPersistencia, String> {

}