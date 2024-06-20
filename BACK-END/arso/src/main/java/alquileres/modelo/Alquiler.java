package alquileres.modelo;

import java.time.LocalDateTime;

public class Alquiler {

	private String idBicicleta;
	private LocalDateTime inicio;
	private LocalDateTime fin;

	public Alquiler(String idBicicleta, LocalDateTime inicio, LocalDateTime fin) {
		this.idBicicleta = idBicicleta;
		this.inicio = inicio;
		this.fin = fin;
	}

	public boolean isActivo() {
		return fin == null;
	}

	public int tiempo() {
		LocalDateTime ahora = LocalDateTime.now();
		int tiempo = 0;
		if (isActivo()) {
			tiempo = ahora.getMinute() - inicio.getMinute();
		} else {
			tiempo = fin.getMinute() - inicio.getMinute();
		}
		return tiempo;
	}

	// Getters y Setters
	public String getIdBicicleta() {
		return idBicicleta;
	}

	public void setIdBicicleta(String idBicicleta) {
		this.idBicicleta = idBicicleta;
	}

	public LocalDateTime getInicio() {
		return inicio;
	}

	public void setInicio(LocalDateTime inicio) {
		this.inicio = inicio;
	}

	public LocalDateTime getFin() {
		return fin;
	}

	public void setFin(LocalDateTime fin) {
		this.fin = fin;
	}

	@Override
	public String toString() {
		return "Alquiler [idBicicleta=" + idBicicleta + ", inicio=" + inicio + ", fin=" + fin + "]";
	}
}
