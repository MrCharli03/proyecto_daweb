package alquileres.modelo;

import java.time.LocalDateTime;
import java.util.LinkedList;

import repository.Identificable;

public class Usuario implements Identificable{

	private String id;
	private LinkedList<Reserva> reservas;
	private LinkedList<Alquiler> alquileres;

	public Usuario(String id) {
		this.id = id;
		reservas = new LinkedList<Reserva>();
		alquileres = new LinkedList<Alquiler>();
	}
	
	public Usuario(String id, LinkedList<Reserva> reservas, LinkedList<Alquiler> alquileres) {
		this.id = id;
		this.reservas = reservas;
		this.alquileres = alquileres;
	}

	public Usuario() {
		this.id = null;
		reservas = new LinkedList<Reserva>();
		alquileres = new LinkedList<Alquiler>();
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}

	public int getReservasCaducadas() {
		int n = 0;
		for (Reserva r : reservas) {
			if (r.isCaducada())
				n++;
		}
		return n;
	}

	public int tiempoUsoHoy() {
		int n = 0;
		LocalDateTime hoy = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
		for (Alquiler alquiler : alquileres) {
			if (alquiler.getInicio().isAfter(hoy))
				n += alquiler.tiempo();
		}
		return n;
	}

	public int tiempoUsoSemana() {
		int n = 0;
		LocalDateTime ultimaSemana = LocalDateTime.now().minusWeeks(1);
		for (Alquiler alquiler : alquileres) {
			if (alquiler.getInicio().isAfter(ultimaSemana))
				n += alquiler.tiempo();
		}
		return n;
	}

	public boolean superaTiempo() {
		return tiempoUsoHoy() >= 60 || tiempoUsoSemana() >= 180;
	}

	public Reserva reservaActiva() {
		if ( reservas.size() > 0 && reservas.getLast().activa()) {
			return reservas.getLast();
		}
		return null;
	}

	public Alquiler alquilerActivo() {
		if ( alquileres.size() > 0 && alquileres.getLast().isActivo()) {
			return alquileres.getLast();
		}
		return null;
	}

	public boolean bloqueado() {
		return getReservasCaducadas() >= 10;
	}

	public void agregarReserva(Reserva reserva) {
		reservas.addLast(reserva);
	}

	public void agregarAlquiler(Alquiler alquiler) {
		alquileres.addLast(alquiler);
	}
	
	public LinkedList<Reserva> getReservas() {
		return reservas;
	}

	public void setReservas(LinkedList<Reserva> reservas) {
		this.reservas = reservas;
	}

	public LinkedList<Alquiler> getAlquileres() {
		return alquileres;
	}

	public void setAlquileres(LinkedList<Alquiler> alquileres) {
		this.alquileres = alquileres;
	}

	@Override
	public String toString() {
		return "Usuario [id=" + id + ", reservas=" + reservas + ", alquileres=" + alquileres + "]";
	}
}
