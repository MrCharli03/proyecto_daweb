package estaciones.dto;

public class AltaBiciDTO {
    private String modelo;
    private String idEstacion;

    public AltaBiciDTO(String modelo, String idEstacion) {
        this.modelo = modelo;
        this.idEstacion = idEstacion;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getIdEstacion() {
        return idEstacion;
    }

    public void setIdEstacion(String idEstacion) {
        this.idEstacion = idEstacion;
    }
}
