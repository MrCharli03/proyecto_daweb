package alquileres.dtos;

public class ReservaDTO {

	private String idBicicleta;
	private String creada;
	private String caducidad;
	private boolean isCaducada;

	public ReservaDTO(String idBicicleta, String creada, String caducidad, boolean isCaducada) {
		this.idBicicleta = idBicicleta;
		this.creada = creada;
		this.caducidad = caducidad;
		this.setCaducada(isCaducada);
	}

	public String getIdBicicleta() {
		return idBicicleta;
	}

	public void setIdBicicleta(String idBicicleta) {
		this.idBicicleta = idBicicleta;
	}

	public String getCreada() {
		return creada;
	}

	public void setCreada(String creada) {
		this.creada = creada;
	}

	public String getCaducidad() {
		return caducidad;
	}

	public void setCaducidad(String caducidad) {
		this.caducidad = caducidad;
	}

	public boolean isCaducada() {
		return isCaducada;
	}

	public void setCaducada(boolean isCaducada) {
		this.isCaducada = isCaducada;
	}

	@Override
	public String toString() {
		return "ReservaDTO [idBicicleta=" + idBicicleta + ", creada=" + creada + ", caducidad=" + caducidad + "]";
	}

}
