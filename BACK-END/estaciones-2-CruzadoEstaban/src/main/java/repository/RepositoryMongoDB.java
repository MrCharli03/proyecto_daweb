package repository;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.Filters;
import com.mongodb.client.result.UpdateResult;

public abstract class RepositoryMongoDB<T extends Identificable> implements RepositoryString<T> {
	
	public abstract MongoCollection<T> getColeccion();
	public abstract MongoCollection<Document> getColeccionSinCodificar();

	@Override
    public String add(T entity) throws RepositorioException {
        try {
        	ObjectId objectId = new ObjectId();
        	entity.setId(objectId.toHexString());
            getColeccion().insertOne(entity);
            return entity.getId(); // Assuming getId() returns the ID of the entity
        } catch (Exception e) {
            throw new RepositorioException("Error guardando la entidad en MongoDB: " + e.getMessage());
        }
    }

    @Override
    public void update(T entity) throws RepositorioException, EntidadNoEncontrada {
    	try {
            // Filtramos por el campo "_id" de la entidad
    		Bson filtro = Filters.eq("_id", new ObjectId(entity.getId()));

            // Utilizamos el método replaceOne que filtra por el campo "_id"
            UpdateResult result = getColeccion().replaceOne(filtro, entity);

            if (result.getMatchedCount() == 0) {
                throw new EntidadNoEncontrada("No se ha encontrado el documento a actualizar");
            }

            if (result.getModifiedCount() == 0) {
                throw new RepositorioException("No se ha actualizado el documento");
            }
        } catch (Exception e) {
            throw new RepositorioException("Error actualizando la entidad en MongoDB: " + e.getMessage());
        }
    }

    @Override
    public void delete(T entity) throws RepositorioException, EntidadNoEncontrada {
        try {
            T existingEntity = getById(entity.getId());
            if (existingEntity != null) {
                getColeccion().deleteOne(Filters.eq("_id", entity.getId()));
            } else {
                throw new EntidadNoEncontrada("Entidad no encontrada por delete()");
            }
        } catch (RepositorioException e) {
            throw new RepositorioException("Error borrando la entidad de MongoDB: " + e.getMessage());
        }
    }

    @Override
    public T getById(String id) throws RepositorioException, EntidadNoEncontrada {
        try {
        	ObjectId objectId = new ObjectId(id);
            return getColeccion().find(Filters.eq("_id", objectId)).first();
        } catch (Exception e) {
            throw new RepositorioException("Error cogiendo la entidad de MongoDB: " + e.getMessage());
        }
    }

    @Override
    public List<T> getAll() throws RepositorioException {
        try {
            FindIterable<T> iterable = getColeccion().find();
            List<T> entities = new ArrayList<>();
            MongoCursor<T> cursor = iterable.iterator();
            while (cursor.hasNext()) {
                entities.add(cursor.next());
            }
            return entities;
        } catch (Exception e) {
            throw new RepositorioException("Error cogiendo todas las entidades de MongoDB: " + e.getMessage());
        }
    }

    @Override
    public List<String> getIds() throws RepositorioException {
        try {
            FindIterable<Document> iterable = getColeccionSinCodificar().find();
            List<String> ids = new ArrayList<>();
            MongoCursor<Document> cursor = iterable.iterator();
            while (cursor.hasNext()) {
                ids.add(cursor.next().getString("_id"));
            }
            return ids;
        } catch (Exception e) {
            throw new RepositorioException("Error cogiendo las ID's de MongoDB: " + e.getMessage());
        }
    }
    
}
