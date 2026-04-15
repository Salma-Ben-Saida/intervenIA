package tn.intervenIA.intervenIA.application.mapper;

import tn.intervenIA.intervenIA.domain.model.incident.Location;
import tn.intervenIA.intervenIA.web.dto.LocationDTO;

public class LocationMapper {
    public static LocationDTO toLocationDTO(Location location) {
        LocationDTO dto = new LocationDTO();
        dto.setAddress(location.getAddress());
        dto.setLng(location.getLng());
        dto.setLat(location.getLat());
        return dto;
    }

    public static Location toLocation(LocationDTO locationDTO) {
        Location location = new Location();
        location.setAddress(locationDTO.getAddress());
        location.setLng(locationDTO.getLng());
        location.setLat(locationDTO.getLat());
        return location;
    }
}
