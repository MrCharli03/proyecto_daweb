package alquileres.repository;

import alquileres.dtos.UsuarioDTO;
import alquileres.mapeadores.MapeadorAlquiler;
import alquileres.mapeadores.MapeadorReserva;
import alquileres.mapeadores.MapeadorUsuario;
import alquileres.modelo.Usuario;
import alquileres.persistencia.jpa.UsuarioEntidadJPA;

public class RepositoryMapeadores {

	MapeadorUsuario mapUsuario = new MapeadorUsuario(new MapeadorAlquiler(), new MapeadorReserva());
	
	public RepositoryMapeadores() {
		
	}

	public Usuario usuarioEntidadJpaToModelo(UsuarioEntidadJPA entidadJpa) {
		return mapUsuario.entidadJPAToModelo(entidadJpa);
	}
	
	public UsuarioEntidadJPA usuarioModeloToEntidadJpa(Usuario usuario) {
		return mapUsuario.modeloToEntidadJPA(usuario);
	}

	public UsuarioDTO usuarioModeloToDTO(Usuario u) {
		return mapUsuario.modeloToDTO(u);
	}
	
}
