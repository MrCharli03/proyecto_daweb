package estaciones.dto;

import org.springframework.format.annotation.DateTimeFormat;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de la entidad Estacion pero sin bicis")
public class EstacionSinBicis {

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
	
	@Schema(description = "Número de huecos libres en la estacion")
	private boolean huecosLibres;

	public EstacionSinBicis(String id, String nombre, int numPuestos, String codPostal, double lat, double lng,
			String fechaAlta, boolean huecosLibres) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.numPuestos = numPuestos;
		this.codPostal = codPostal;
		this.lat = lat;
		this.lng = lng;
		this.fechaAlta = fechaAlta;
		this.huecosLibres = huecosLibres;
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

	public boolean isHuecosLibres() {
		return huecosLibres;
	}

	public void setHuecosLibres(boolean huecosLibres) {
		this.huecosLibres = huecosLibres;
	}

	@Override
	public String toString() {
		return "Estacion [id=" + id + ", nombre=" + nombre + ", num_puestos=" + numPuestos + ", codPostal=" + codPostal
				+ ", lat=" + lat + ", lng=" + lng + "]";
	}
}
