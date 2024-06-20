package estaciones.modelo;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

public class Estacion {

	private String id;
	private String nombre;
	private int numPuestos;
	private String codPostal;
	private double lat;
	private double lng;
	private LocalDateTime fechaAlta;

	private List<Bici> bicis;

	public Estacion() {

	}

	public Estacion(String nombre, int num_puestos, String codPostal, double lat, double lng) {
		this.nombre = nombre;
		this.numPuestos = num_puestos;
		this.codPostal = codPostal;
		this.lat = lat;
		this.lng = lng;
		this.bicis = new LinkedList<Bici>();
		this.fechaAlta = LocalDateTime.now();
	}

	// Para la transformacion a JPA
	public Estacion(String id, String nombre, int numPuestos, String codPostal, double lat, double lng,
			LocalDateTime fechaAlta, List<Bici> bicis) {
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

	public List<Bici> getBicis() {
		return bicis;
	}

	public void setBicis(List<Bici> bicis) {
		this.bicis = bicis;
	}

	public LocalDateTime getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(LocalDateTime fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	@Override
	public String toString() {
		return "Estacion [id=" + id + ", nombre=" + nombre + ", num_puestos=" + numPuestos + ", codPostal=" + codPostal
				+ ", lat=" + lat + ", lng=" + lng + "]";
	}
	
	public void estacionaBici(Bici bici) {
		bicis.add(bici);
		numPuestos--;
	}

	public void retiraBici(String idBici) {
		for (Bici b : bicis) {
			if (b.getId().equals(idBici)) {
				bicis.remove(b);
				numPuestos++;
				break;
			}
		}
	}

}