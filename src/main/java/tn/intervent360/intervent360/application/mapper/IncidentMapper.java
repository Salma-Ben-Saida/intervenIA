package tn.intervent360.intervent360.application.mapper;


import tn.intervent360.intervent360.domain.model.incident.*;
import tn.intervent360.intervent360.web.dto.IncidentDTO;

public class IncidentMapper {

    public static IncidentDTO toDTO(Incident incident) {
        if (incident == null) return null;

        IncidentDTO dto = new IncidentDTO();
        dto.setId(incident.getId());
        dto.setDescription(incident.getDescription());
        dto.setPhotos(incident.getPhotos());
        dto.setCitizenId(incident.getCitizenId());

        dto.setAiEnabled(incident.getAiEnabled());
        dto.setAiConfidence(incident.getAiConfidence());
        dto.setUrgencyLevel(incident.getUrgencyLevel());
        dto.setIncidentType(incident.getIncidentType());
        dto.setIncidentStatus(incident.getIncidentStatus());

        if (incident.getLocation() != null) {
            dto.setLat(incident.getLocation().getLat());
            dto.setLng(incident.getLocation().getLng());
            dto.setAddress(incident.getLocation().getAddress());
        }

        return dto;
    }

    public static Incident toEntity(IncidentDTO dto) {
        if (dto == null) return null;

        Incident incident = new Incident();
        incident.setId(dto.getId());
        incident.setDescription(dto.getDescription());
        incident.setPhotos(dto.getPhotos());
        incident.setCitizenId(dto.getCitizenId());

        incident.setAiEnabled(dto.getAiEnabled());
        incident.setAiConfidence(dto.getAiConfidence());
        incident.setUrgencyLevel(dto.getUrgencyLevel());
        incident.setIncidentType(dto.getIncidentType());
        incident.setIncidentStatus(dto.getIncidentStatus());

        if (dto.getLat() != null && dto.getLng() != null) {
            incident.setLocation(new Location(dto.getLat(), dto.getLng(), dto.getAddress()));
        }

        return incident;
    }
}

