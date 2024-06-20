package alquileres.mapeadores;

import alquileres.dtos.AlquilerDTO;
import alquileres.modelo.Alquiler;
import alquileres.persistencia.jpa.AlquilerEntidadJPA;
import alquileres.persistencia.jpa.UsuarioEntidadJPA;

public class MapeadorAlquiler {

	public MapeadorAlquiler() {

	}
	
	public AlquilerEntidadJPA modeloToEntidadJPA(Alquiler a, UsuarioEntidadJPA u) {
		AlquilerEntidadJPA aJPA = new AlquilerEntidadJPA(a.getIdBicicleta(), a.getInicio(), a.getFin(), u);
		return aJPA;
	}
	
	public Alquiler entidadJPAToModelo(AlquilerEntidadJPA aJPA) {
		Alquiler a = new Alquiler(aJPA.getIdBicicleta(), aJPA.getInicio(), aJPA.getFin());
		return a;
	}
	
	public AlquilerDTO modeloToDTO(Alquiler a) {
		String fin = null;
		if (a.getFin() != null) fin = a.getFin().toString();
		return new AlquilerDTO(a.getIdBicicleta(), a.getInicio().toString(), fin, a.isActivo());
	}

}