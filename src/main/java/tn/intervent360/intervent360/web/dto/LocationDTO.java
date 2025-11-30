package tn.intervent360.intervent360.web.dto;
import lombok.Data;

@Data
public class LocationDTO {
    private double lat;
    private double lng;
    private String address;
}
