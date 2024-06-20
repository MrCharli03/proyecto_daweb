package repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/*
 * Implementaci�n del repositorio para realizar pruebas.
 * Establece como requisito poder gestionar el identificador de las entidades (interfaz Identificable).
 * Las operaciones eliminan la excepci�n RepositorioException porque no hay
 * sistema de persistencia que pueda fallar.
 */
public class RepositoryMemorie<T extends Identificable> implements RepositoryString<T> {

	private HashMap<String, T> entidades = new HashMap<>();
	
	private int id = 1; // asigna secuencialmente los identificadores
	
	@Override
	public String add(T entity) {
		
		String id = String.valueOf(this.id++);
		
		if (entity.getId()==null)
			entity.setId(id);
		
		this.getEntidades().put(id, entity);		
		
		return id;
	}

	@Override
	public void update(T entity) throws EntidadNoEncontrada {
		
		if (! this.getEntidades().containsKey(entity.getId()))
			throw new EntidadNoEncontrada(entity.getId() + " no existe en el repositorio");
		
		this.getEntidades().put(entity.getId(), entity);
	}

	@Override
	public void delete(T entity) throws EntidadNoEncontrada {
		
		if (! this.getEntidades().containsKey(entity.getId()))
			throw new EntidadNoEncontrada(entity.getId() + " no existe en el repositorio");
		
		this.getEntidades().remove(entity.getId());
	}

	@Override
	public T getById(String id) throws EntidadNoEncontrada {
		
		if (! this.getEntidades().containsKey(id))
			throw new EntidadNoEncontrada(id + " no existe en el repositorio");
		
		return this.getEntidades().get(id);
	}

	@Override
	public List<T> getAll() {
		
		return new ArrayList<>(this.getEntidades().values());
	}

	@Override
	public List<String> getIds() {
		return new ArrayList<>(this.getEntidades().keySet());
	}

	protected HashMap<String, T> getEntidades() {
		return entidades;
	}

	public void setEntidades(HashMap<String, T> entidades) {
		this.entidades = entidades;
	}

}
