package alquileres.modelo;

import java.time.LocalDateTime;

public class Reserva {

	private String idBicicleta;
	private LocalDateTime creada;
	private LocalDateTime caducidad;

	public Reserva(String idBicicleta, LocalDateTime caducidad) {
		this.idBicicleta = idBicicleta;
		creada = LocalDateTime.now();
		this.caducidad = caducidad;
	}

	public Reserva(String idBicicleta, LocalDateTime creada, LocalDateTime caducidad) {
		this.idBicicleta = idBicicleta;
		this.creada = creada;
		this.caducidad = caducidad;
	}

	public boolean isCaducada() {
		return LocalDateTime.now().isAfter(caducidad);
	}

	public boolean activa() {
		return !isCaducada();
	}

	// Getters y Setters
	public String getIdBicicleta() {
		return idBicicleta;
	}

	public void setIdBicicleta(String idBicicleta) {
		this.idBicicleta = idBicicleta;
	}

	public LocalDateTime getCreada() {
		return creada;
	}

	public void setCreada(LocalDateTime creada) {
		this.creada = creada;
	}

	public LocalDateTime getCaducidad() {
		return caducidad;
	}

	public void setCaducidad(LocalDateTime caducidad) {
		this.caducidad = caducidad;
	}

	@Override
	public String toString() {
		return "Reserva [idBicicleta=" + idBicicleta + ", creada=" + creada + ", caducidad=" + caducidad + "]";
	}
}
