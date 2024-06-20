package estaciones.persistencia;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import repository.Identificable;

@Document(collection = "estaciones")
public class EstacionPersistencia implements Identificable {
	
	@Id
	private String id;
	private String nombre;
	@Field("num_puestos")
	private int numPuestos;
	@Field("cod_postal")
	private String codPostal;
	private double lat;
	private double lng;
	@Field("fecha_alta")
	private LocalDateTime fechaAlta;

	private List<BiciPersistencia> bicis;

	public EstacionPersistencia() {

	}

	public EstacionPersistencia(String id, String nombre, int numPuestos, String codPostal, double lat, double lng,
			LocalDateTime fechaAlta, List<BiciPersistencia> bicis) {
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



	@Override
	public String getId() {
		return id;
	}

	@Override
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

	public LocalDateTime getFechaAlta() {
		return fechaAlta;
	}

	public void setFechaAlta(LocalDateTime fechaAlta) {
		this.fechaAlta = fechaAlta;
	}

	public List<BiciPersistencia> getBicis() {
		return bicis;
	}

	public void setBicis(List<BiciPersistencia> bicis) {
		this.bicis = bicis;
	}
}
