package alquileres.persistencia.jpa;

import java.util.LinkedList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import repository.Identificable;

@Entity
@Table(name = "usuarioEntidadJPA")
public class UsuarioEntidadJPA implements Identificable{

	@Id
	private String id;
	@OneToMany(mappedBy = "usuarioEntidadJPA", cascade = CascadeType.ALL, orphanRemoval = true) //los que no tenga padre que se borre
	private List<ReservaEntidadJPA> reservas;
	@OneToMany(mappedBy = "usuarioEntidadJPA", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<AlquilerEntidadJPA> alquileres;
	
	public UsuarioEntidadJPA() {

	}

	public UsuarioEntidadJPA(String id) {
		this.id = id;
		this.reservas = new LinkedList<ReservaEntidadJPA>();
		this.alquileres = new LinkedList<AlquilerEntidadJPA>();
	}

	public UsuarioEntidadJPA(String id, List<ReservaEntidadJPA> reservas, List<AlquilerEntidadJPA> alquileres) {
		super();
		this.id = id;
		this.reservas = reservas;
		this.alquileres = alquileres;
	}

	@Override
	public String getId() {
		// TODO Auto-generated method stub
		return this.id;
	}

	@Override
	public void setId(String id) {
		// TODO Auto-generated method stub
		this.id=id;
	}

	public List<ReservaEntidadJPA> getReservas() {
		return reservas;
	}

	public List<AlquilerEntidadJPA> getAlquileres() {
		return alquileres;
	}

	public void setReservas(List<ReservaEntidadJPA> reservas) {
		this.reservas = reservas;
	}

	public void setAlquileres(List<AlquilerEntidadJPA> alquileres) {
		this.alquileres = alquileres;
	}

	@Override
	public String toString() {
		return "Usuario [id=" + id + ", reservas=" + reservas + ", alquileres=" + alquileres + "]";
	}
	
}
