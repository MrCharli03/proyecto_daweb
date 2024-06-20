package estaciones.dto;

public class AltaEstacionDTO {
    private String nombre;
    private int numPuestos;
    private String codPostal;
    private double lat;
    private double lng;

    public AltaEstacionDTO(String nombre, int numPuestos, String codPostal, double lat, double lng) {
        this.nombre = nombre;
        this.numPuestos = numPuestos;
        this.codPostal = codPostal;
        this.lat = lat;
        this.lng = lng;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getNumPuestos() {
        return numPuestos;
    }

    public void setNumPuestos(int numPuestos) {
        this.numPuestos = numPuestos;
    }

    public String getCodPostal() {
        return codPostal;
    }

    public void setCodPostal(String codPostal) {
        this.codPostal = codPostal;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }
}

