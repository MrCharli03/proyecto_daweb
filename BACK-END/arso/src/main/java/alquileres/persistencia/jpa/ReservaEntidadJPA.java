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
@Table(name = "reservaEntidadJPA")
public class ReservaEntidadJPA implements Identificable{
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private String id;
	@Column(name = "idBicicleta")
	private String idBicicleta;
	@Column(name = "fecha_creacion", columnDefinition = "TIMESTAMP")
	private LocalDateTime creada;
	@Column(name = "fecha_caducidad", columnDefinition = "TIMESTAMP")
	private LocalDateTime caducidad;
	
	@ManyToOne
	@JoinColumn(name = "usuarioEntidadJPA_fk")
	private UsuarioEntidadJPA usuarioEntidadJPA;
	
	public ReservaEntidadJPA() {
		
	}
	
	public ReservaEntidadJPA(String idBicicleta, LocalDateTime creada, LocalDateTime caducidad,
			UsuarioEntidadJPA usuarioEntidadJPA) {
		this.idBicicleta = idBicicleta;
		this.creada = creada;
		this.caducidad = caducidad;
		this.usuarioEntidadJPA = usuarioEntidadJPA;
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
	
	//propiedades calculadas
	
	public boolean isCaducada() {
		return LocalDateTime.now().isAfter(caducidad);
	}

	public boolean activa() {
		return !isCaducada();
	}
	
	@Override
	public String toString() {
		return "Reserva [idBicicleta=" + idBicicleta + ", creada=" + creada + ", caducidad=" + caducidad + "]";
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

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ReservaEntidadJPA other = (ReservaEntidadJPA) obj;
		return Objects.equals(caducidad, other.caducidad) && Objects.equals(creada, other.creada)
				&& Objects.equals(id, other.id) && Objects.equals(idBicicleta, other.idBicicleta)
				&& Objects.equals(usuarioEntidadJPA, other.usuarioEntidadJPA);
	}
	
	
	
}
