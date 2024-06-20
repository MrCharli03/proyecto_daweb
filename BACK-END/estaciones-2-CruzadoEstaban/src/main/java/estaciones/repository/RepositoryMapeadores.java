package estaciones.repository;

import estaciones.dto.BiciDTO;
import estaciones.dto.EstacionDTO;
import estaciones.mapeadores.MapeadorBici;
import estaciones.mapeadores.MapeadorEstacion;
import estaciones.modelo.Bici;
import estaciones.modelo.Estacion;
import estaciones.persistencia.BiciPersistencia;
import estaciones.persistencia.EstacionPersistencia;

public class RepositoryMapeadores {

	MapeadorBici mapBici = new MapeadorBici();
	MapeadorEstacion mapEstacion = new MapeadorEstacion(mapBici);
	
	public RepositoryMapeadores() {
		
	}
	
	public Bici biciEntidadJpaToModelo(BiciPersistencia entidadJpa) {
		return mapBici.entidadJPAToModelo(entidadJpa);
	}

	public Estacion estacionEntidadJpaToModelo(EstacionPersistencia entidadJpa) {
		return mapEstacion.entidadJPAToModelo(entidadJpa);
	}
	
	public BiciPersistencia biciModeloToEntidadJpa(Bici bici) {
		return mapBici.modeloToEntidadJPA(bici);
	}
	
	public EstacionPersistencia estacionModeloToEntidadJpa(Estacion estacion) {
		return mapEstacion.modeloToEntidadJPA(estacion);
	}

	public BiciDTO biciModeloToDTO(Bici b) {
		return mapBici.modeloToDTO(b);
	}
	
	public EstacionDTO estacionModeloToDTO(Estacion e) {
		return mapEstacion.modeloToDTO(e);
	}
}
