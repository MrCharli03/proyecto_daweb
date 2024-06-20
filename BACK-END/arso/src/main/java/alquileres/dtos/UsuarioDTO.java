package alquileres.dtos;

import java.util.LinkedList;

public class UsuarioDTO {

	private LinkedList<ReservaDTO> reservas;
	private LinkedList<AlquilerDTO> alquileres;
	private int reservasCaducadas;

	public UsuarioDTO(LinkedList<ReservaDTO> reservas, LinkedList<AlquilerDTO> alquileres, int reservasCaducadas) {
		this.reservas = reservas;
		this.alquileres = alquileres;
		this.reservasCaducadas = reservasCaducadas;
	}

	public LinkedList<ReservaDTO> getReservas() {
		return reservas;
	}

	public void setReservas(LinkedList<ReservaDTO> reservas) {
		this.reservas = reservas;
	}

	public LinkedList<AlquilerDTO> getAlquileres() {
		return alquileres;
	}

	public void setAlquileres(LinkedList<AlquilerDTO> alquileres) {
		this.alquileres = alquileres;
	}

	public int getReservasCaducadas() {
		return reservasCaducadas;
	}

	public void setReservasCaducadas(int reservasCaducadas) {
		this.reservasCaducadas = reservasCaducadas;
	}

	@Override
	public String toString() {
		return "UsuarioDTO [reservas=" + reservas + ", alquileres=" + alquileres + "]";
	}
	
}
