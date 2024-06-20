package estaciones.dto;

import org.springframework.format.annotation.DateTimeFormat;

import estaciones.modelo.EstadoBici;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de la entidad Bici")
public class BiciDTO {

	@Schema(description = "Identificador de la bici")
	private String id;
	
	@Schema(description = "Modelo", example = "BMX 4K")
	private String modelo;
	
	@Schema(description = "Fecha de alta", example = "2000-10-31T01:30:00.000-05:00")
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	private String fechaAlta;
	
	@Schema(description = "Fecha de baja", example = "2000-10-31T01:30:00.000-05:00")
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	private String fechaBaja;
	
	@Schema(description = "Motivo de baja", example = "Está roto el manillar")
	private String motivo;
	
	@Schema(description = "Estado de una bici", example = "DISPONIBLE")
	private EstadoBici estado;
	
	@Schema(description = "Identificador de la estacion donde está la bici aparcada")
	private String estacionID;

	public BiciDTO(String id, String modelo, String fechaAlta, String fechaBaja, String motivo, EstadoBici estado,
			String estacionID) {
		super();
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

	public String getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(String fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public String getFechaBaja() {
		return fechaBaja;
	}

	public void setFechaBaja(String fechaBaja) {
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
		return "BiciDTO [id=" + id + ", modelo=" + modelo + ", fechaAlta=" + fechaAlta + ", fechaBaja=" + fechaBaja
				+ ", motivo=" + motivo + ", estado=" + estado + ", estacionID=" + estacionID + "]";
	}
}
