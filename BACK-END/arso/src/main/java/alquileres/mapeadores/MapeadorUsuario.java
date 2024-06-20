package alquileres.mapeadores;

import java.util.LinkedList;
import java.util.List;

import alquileres.dtos.AlquilerDTO;
import alquileres.dtos.ReservaDTO;
import alquileres.dtos.UsuarioDTO;
import alquileres.modelo.Alquiler;
import alquileres.modelo.Reserva;
import alquileres.modelo.Usuario;
import alquileres.persistencia.jpa.AlquilerEntidadJPA;
import alquileres.persistencia.jpa.ReservaEntidadJPA;
import alquileres.persistencia.jpa.UsuarioEntidadJPA;

public class MapeadorUsuario {

	private MapeadorAlquiler mapAlquiler;
	private MapeadorReserva mapReserva;
	
	public MapeadorUsuario(MapeadorAlquiler mapAlquiler, MapeadorReserva mapReserva) {
		this.mapAlquiler = mapAlquiler;
		this.mapReserva = mapReserva;
	}

	public UsuarioEntidadJPA modeloToEntidadJPA(Usuario u) {
		List<AlquilerEntidadJPA> alquilerJPA = new LinkedList<AlquilerEntidadJPA>();
		List<ReservaEntidadJPA> reservaJPA = new LinkedList<ReservaEntidadJPA>();
		
		UsuarioEntidadJPA uJPA = new UsuarioEntidadJPA(u.getId());
		for (Alquiler alquilerModelo : u.getAlquileres()) {
			alquilerJPA.add(mapAlquiler.modeloToEntidadJPA(alquilerModelo, uJPA));
		}
		for (Reserva reservaModelo : u.getReservas()) {
			reservaJPA.add(mapReserva.modeloToEntidadJPA(reservaModelo, uJPA));
		}
		uJPA.setAlquileres(alquilerJPA);
		uJPA.setReservas(reservaJPA);
		return uJPA;
	}
	
	public Usuario entidadJPAToModelo(UsuarioEntidadJPA uJPA) {
		LinkedList<Alquiler> alquilerModelo = new LinkedList<Alquiler>();
		LinkedList<Reserva> reservaModelo = new LinkedList<Reserva>();
		
		for (AlquilerEntidadJPA alquilerEntidadJPA : uJPA.getAlquileres()) {
			alquilerModelo.add(mapAlquiler.entidadJPAToModelo(alquilerEntidadJPA));
		}
		
		for (ReservaEntidadJPA reservaEntidadJPA : uJPA.getReservas()) {
			reservaModelo.add(mapReserva.entidadJPAToModelo(reservaEntidadJPA));
		}
		Usuario u = new Usuario(uJPA.getId(), reservaModelo, alquilerModelo);
		return u;
	}
	
	public UsuarioDTO modeloToDTO(Usuario u) {
		LinkedList<ReservaDTO> reservasDTO = new LinkedList<ReservaDTO>();
		LinkedList<AlquilerDTO> alquileresDTO = new LinkedList<AlquilerDTO>();
		
		for (Reserva reserva : u.getReservas()) {
			reservasDTO.add(mapReserva.modeloToDTO(reserva));
		}
		
		
		for (Alquiler alquiler : u.getAlquileres()) {
			alquileresDTO.add(mapAlquiler.modeloToDTO(alquiler));
		}
		
		return new UsuarioDTO(reservasDTO, alquileresDTO, u.getReservasCaducadas());
	}
}
