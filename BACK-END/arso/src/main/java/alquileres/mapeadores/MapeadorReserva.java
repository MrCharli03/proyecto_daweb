package alquileres.mapeadores;

import alquileres.dtos.ReservaDTO;
import alquileres.modelo.Reserva;
import alquileres.persistencia.jpa.ReservaEntidadJPA;
import alquileres.persistencia.jpa.UsuarioEntidadJPA;

public class MapeadorReserva {

	public MapeadorReserva() { 

	}

	public ReservaEntidadJPA modeloToEntidadJPA(Reserva r, UsuarioEntidadJPA u) {
		ReservaEntidadJPA rJPA = new ReservaEntidadJPA(r.getIdBicicleta(), r.getCreada(), r.getCaducidad(), u);
		return rJPA;
	}
	
	public Reserva entidadJPAToModelo(ReservaEntidadJPA rJPA) {
		Reserva r = new Reserva(rJPA.getIdBicicleta(), rJPA.getCreada(), rJPA.getCaducidad());
		return r;
	}
	
	public ReservaDTO modeloToDTO(Reserva r) {
		return new ReservaDTO(r.getIdBicicleta(), r.getCreada().toString(), r.getCaducidad().toString(), r.isCaducada());
	}
}
