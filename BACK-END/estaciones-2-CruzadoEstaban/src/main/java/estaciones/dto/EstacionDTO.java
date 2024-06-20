package estaciones.dto;

import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de la entidad Estacion")
public class EstacionDTO {

	@Schema(description = "Identificador de la estacion")
	private String id;
	
	@Schema(description = "Fecha de alta", example = "Murcia Centro")
	private String nombre;
	
	@Schema(description = "Fecha de alta")
	private int numPuestos;
	
	@Schema(description = "Fecha de alta", example = "30007")
	private String codPostal;
	
	@Schema(description = "Fecha de alta", example = "37.98404304367661")
	private double lat;
	
	@Schema(description = "Fecha de alta", example = "-1.1285752035593704")
	private double lng;
	
	@Schema(description = "Fecha de alta", example = "2000-10-31T01:30:00.000-05:00")
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
	private String fechaAlta;
	
	@Schema(description = "Bicis de la estacion")
	private List<BiciDTO> bicis;

	public EstacionDTO(String id, String nombre, int numPuestos, String codPostal, double lat, double lng,
			String fechaAlta, List<BiciDTO> bicis) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.numPuestos = numPuestos;
		this.codPostal = codPostal;
		this.lat = lat;
		this.lng = lng;
		this.fechaAlta = fechaAlta;
		this.bicis = bicis;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public int getNumPuestos() {
		return numPuestos;
	}

	public void setNumPuestos(int numPuestos) {
		this.numPuestos = numPuestos;
	}

	public String getCodPostal() {
		return codPostal;
	}

	public void setCodPostal(String codPostal) {
		this.codPostal = codPostal;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public double getLng() {
		return lng;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}

	public String getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(String fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public List<BiciDTO> getBicis() {
		return bicis;
	}

	public void setBicis(List<BiciDTO> bicis) {
		this.bicis = bicis;
	}

	@Override
	public String toString() {
		return "EstacionDTO [id=" + id + ", nombre=" + nombre + ", numPuestos=" + numPuestos + ", codPostal="
				+ codPostal + ", lat=" + lat + ", lng=" + lng + ", fechaAlta=" + fechaAlta + ", bicis=" + bicis + "]";
	}
}
