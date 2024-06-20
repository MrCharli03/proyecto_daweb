package alquileres.repository;

import alquileres.persistencia.jpa.UsuarioEntidadJPA;
import repository.RepositoryJPA;

public class RepositoryUsuarioJPA extends RepositoryJPA<UsuarioEntidadJPA> implements RepositoryUsuarioEntidad {

	@Override
	public Class<UsuarioEntidadJPA> getClase() {
		return UsuarioEntidadJPA.class;
	}

	@Override
	public String getNombre() {
		return  UsuarioEntidadJPA.class.getName();
	}

}
