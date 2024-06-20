package alquileres.persistencia.jpa;

import java.time.LocalDateTime;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import repository.Identificable;

@Entity
@Table(name = "alquilerEntidadJPA")
public class AlquilerEntidadJPA implements Identificable {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private String id;
	@Column(name = "idBicicleta")
	private String idBicicleta;
	@Column(name = "fecha_inicio", columnDefinition = "TIMESTAMP")
	private LocalDateTime inicio;
	@Column(name = "fecha_fin", columnDefinition = "TIMESTAMP")
	private LocalDateTime fin;
	
	@ManyToOne
	@JoinColumn(name = "usuarioEntidadJPA_fk")
	private UsuarioEntidadJPA usuarioEntidadJPA;
	
	public AlquilerEntidadJPA() {
		
	}
	
	public AlquilerEntidadJPA(String idBicicleta, LocalDateTime inicio, LocalDateTime fin,
			UsuarioEntidadJPA usuarioEntidadJPA) {
		this.idBicicleta = idBicicleta;
		this.inicio = inicio;
		this.fin = fin;
		this.usuarioEntidadJPA = usuarioEntidadJPA;
	}



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

	@Override
	public String getId() {
		return this.id;
	}

	@Override
	public void setId(String id) {
		this.id = id;
	}
	
	public UsuarioEntidadJPA getUsuarioEntidadJPA() {
		return usuarioEntidadJPA;
	}

	public void setUsuarioEntidadJPA(UsuarioEntidadJPA usuarioEntidadJPA) {
		this.usuarioEntidadJPA = usuarioEntidadJPA;
	}
	
	//propiedades calculadas

	public boolean isActivo() {
		return fin == null;
	}

	public int tiempo() {
		LocalDateTime ahora = LocalDateTime.now();
		int tiempo = 0;
		if (isActivo()) {
			tiempo = ahora.getMinute() - inicio.getMinute();
		}
		{
			tiempo = fin.getMinute() - inicio.getMinute();
		}
		return tiempo;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AlquilerEntidadJPA other = (AlquilerEntidadJPA) obj;
		return Objects.equals(fin, other.fin) && Objects.equals(id, other.id)
				&& Objects.equals(idBicicleta, other.idBicicleta) && Objects.equals(inicio, other.inicio)
				&& Objects.equals(usuarioEntidadJPA, other.usuarioEntidadJPA);
	}
	
	
	
}
