package estaciones.mapeadores;

import estaciones.dto.BiciDTO;
import estaciones.modelo.Bici;
import estaciones.persistencia.BiciPersistencia;

public class MapeadorBici {

	public MapeadorBici() {

	}

	public BiciPersistencia modeloToEntidadJPA(Bici b) {
		BiciPersistencia bJPA = new BiciPersistencia(b.getId(), b.getModelo(), b.getFechaAlta(), b.getFechaBaja(),
				b.getMotivo(), b.getEstado(), b.getEstacionID());
		return bJPA;
	}

	public Bici entidadJPAToModelo(BiciPersistencia bJPA) {
		Bici b = new Bici(bJPA.getId(), bJPA.getModelo(), bJPA.getFechaAlta(), bJPA.getFechaBaja(), bJPA.getMotivo(),
				bJPA.getEstado(), bJPA.getEstacionID());
		return b;
	}

	public BiciDTO modeloToDTO(Bici b) {
		String fechaBaja;
		if (b.getFechaBaja() == null)
			fechaBaja = null;
		else
			fechaBaja = b.getFechaBaja().toString();
		return new BiciDTO(b.getId(), b.getModelo(), b.getFechaAlta().toString(), fechaBaja, b.getMotivo(),
				b.getEstado(), b.getEstacionID());
	}
}
