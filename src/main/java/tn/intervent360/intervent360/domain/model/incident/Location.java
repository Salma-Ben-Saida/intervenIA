package tn.intervent360.intervent360.domain.model.incident;
import lombok.Getter;
import lombok.Setter;

public class Location {
    @Getter @Setter
    private double lat;

    @Getter @Setter
    private double lng;

    @Getter @Setter
    private String address;

    public Location() {}

    public Location(double lat, double lng, String address) {
        this.lat = lat;
        this.lng = lng;
        this.address = address;
    }
}
