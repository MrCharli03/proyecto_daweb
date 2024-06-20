package estaciones.mapeadores;

import java.util.LinkedList;
import java.util.List;

import estaciones.dto.BiciDTO;
import estaciones.dto.EstacionDTO;
import estaciones.modelo.Bici;
import estaciones.modelo.Estacion;
import estaciones.persistencia.BiciPersistencia;
import estaciones.persistencia.EstacionPersistencia;

public class MapeadorEstacion {

	private MapeadorBici mapBici;
	
	public MapeadorEstacion(MapeadorBici mapBici) {
		this.mapBici = mapBici;
	}

	public EstacionPersistencia modeloToEntidadJPA(Estacion e) {
		List<BiciPersistencia> bicis = new LinkedList<BiciPersistencia>();
		for (Bici bici : e.getBicis()) {
			bicis.add(mapBici.modeloToEntidadJPA(bici));
		}
		EstacionPersistencia eJPA = new EstacionPersistencia(e.getId(), e.getNombre(), e.getNumPuestos(), e.getCodPostal(), e.getLat(), e.getLng(), e.getFechaAlta(), bicis);
		return eJPA;
	}
	
	public Estacion entidadJPAToModelo(EstacionPersistencia eJPA) {
		List<Bici> bicis = new LinkedList<Bici>();
		for (BiciPersistencia bici : eJPA.getBicis()) {
			bicis.add(mapBici.entidadJPAToModelo(bici));
		}
		Estacion e = new Estacion(eJPA.getId(), eJPA.getNombre(), eJPA.getNumPuestos(), eJPA.getCodPostal(), eJPA.getLat(), eJPA.getLng(), eJPA.getFechaAlta(), bicis);
		return e;
	}
	
	public EstacionDTO modeloToDTO(Estacion e) {
		List<BiciDTO> bicisDTO = new LinkedList<BiciDTO>();
		for (Bici bici : e.getBicis()) {
			bicisDTO.add(mapBici.modeloToDTO(bici));
		}
		return new EstacionDTO(e.getId(), e.getNombre(), e.getNumPuestos(), e.getCodPostal(), e.getLat(), e.getLng(), e.getFechaAlta().toString(), bicisDTO);
	}
}