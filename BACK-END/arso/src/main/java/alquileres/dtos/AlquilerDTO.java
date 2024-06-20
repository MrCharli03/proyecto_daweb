package alquileres.dtos;

public class AlquilerDTO {

	private String idBicicleta;
	private String inicio;
	private String fin;
	private boolean isActivo;
	
	public AlquilerDTO(String idBicicleta, String inicio, String fin, boolean isActivo) {
		this.idBicicleta = idBicicleta;
		this.inicio = inicio;
		this.fin = fin;
		this.setActivo(isActivo);
	}

	public String getIdBicicleta() {
		return idBicicleta;
	}

	public void setIdBicicleta(String idBicicleta) {
		this.idBicicleta = idBicicleta;
	}

	public String getInicio() {
		return inicio;
	}

	public void setInicio(String inicio) {
		this.inicio = inicio;
	}

	public String getFin() {
		return fin;
	}

	public void setFin(String fin) {
		this.fin = fin;
	}

	public boolean isActivo() {
		return isActivo;
	}

	public void setActivo(boolean isActivo) {
		this.isActivo = isActivo;
	}

	@Override
	public String toString() {
		return "AlquilerDTO [idBicicleta=" + idBicicleta + ", inicio=" + inicio + ", fin=" + fin + "]";
	}
	
}
