package estaciones.modelo;

import java.time.LocalDateTime;

public class Bici {

	private String id;
	private String modelo;
	private LocalDateTime fechaAlta;
	private LocalDateTime fechaBaja;
	private String motivo;
	private EstadoBici estado;

	private String estacionID;
	
	public Bici(String modelo, LocalDateTime fechaAlta) {
		this.modelo = modelo;
		this.fechaAlta = fechaAlta;
		estado = EstadoBici.DISPONIBLE;
	}

	// Para la transformacion a JPA
	public Bici(String id, String modelo, LocalDateTime fechaAlta, LocalDateTime fechaBaja, String motivo,
			EstadoBici estado, String estacionID) {
		this.id = id;
		this.modelo = modelo;
		this.fechaAlta = fechaAlta;
		this.fechaBaja = fechaBaja;
		this.motivo = motivo;
		this.estado = estado;
		this.estacionID = estacionID;
	}

	public String getId() {
		return id;
	}

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

	@Override
	public String toString() {
		return "Bici [id=" + id + ", modelo=" + modelo + ", fechaAlta=" + fechaAlta + ", fechaBaja=" + fechaBaja
				+ ", motivo=" + motivo + ", estado=" + estado + ", estacionID=" + estacionID + "]";
	}
}