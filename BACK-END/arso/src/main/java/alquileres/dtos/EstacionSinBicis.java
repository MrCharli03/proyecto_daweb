package alquileres.dtos;


public class EstacionSinBicis {
	
	private String id;

	private String nombre;

	private int numPuestos;

	private String codPostal;

	private double lat;

	private double lng;

	private String fechaAlta;

	private boolean huecosLibres;

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
