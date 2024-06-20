package estaciones.persistencia;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import estaciones.modelo.EstadoBici;
import repository.Identificable;

@Document(collection = "bicis")
public class BiciPersistencia implements Identificable {

	@Id
	private String id;
	private String modelo;
	@Field("fecha_alta")
	private LocalDateTime fechaAlta;
	@Field("fecha_baja")
	private LocalDateTime fechaBaja;
	private String motivo;
	private EstadoBici estado;
	@Field("estacion_id")
	private String estacionID;

	public BiciPersistencia() {

	}

	public BiciPersistencia(String id, String modelo, LocalDateTime fechaAlta, LocalDateTime fechaBaja, String motivo,
			EstadoBici estado, String estacionID) {
		this.id = id;
		this.modelo = modelo;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.motivo = motivo;
		this.estado = estado;
		this.estacionID = estacionID;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public void setId(String id) {
		this.id = id;
	}

	public String getModelo() {
		return modelo;
	}

	public void setModelo(String modelo) {
		this.modelo = modelo;
	}

	public LocalDateTime getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(LocalDateTime fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public LocalDateTime getFechaBaja() {
		return fechaBaja;
	}

	public void setFechaBaja(LocalDateTime fechaBaja) {
		this.fechaBaja = fechaBaja;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}

	public EstadoBici getEstado() {
		return estado;
	}

	public void setEstado(EstadoBici estado) {
		this.estado = estado;
	}

	public String getEstacionID() {
		return estacionID;
	}

	public void setEstacionID(String estacionID) {
		this.estacionID = estacionID;
	}
}
