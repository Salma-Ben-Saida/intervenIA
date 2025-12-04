package tn.intervent360.intervent360.application.mapper;


import tn.intervent360.intervent360.domain.model.incident.*;
import tn.intervent360.intervent360.web.dto.incident.IncidentDTO;

public class IncidentMapper {

    public static IncidentDTO toDTO(Incident entity) {
        if (entity == null) return null;

        IncidentDTO dto = new IncidentDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());

        dto.setPhotos(entity.getPhotos());
        dto.setSubmittedAt(entity.getSubmittedAt());
        dto.setCitizenId(entity.getCitizenId());

        dto.setAiEnabled(entity.getAiEnabled());
        dto.setAiConfidence(entity.getAiConfidence());
        dto.setAiPredictedName(entity.getAiPredictedName());

        dto.setAiPredictedUrgency(entity.getAiPredictedUrgency());
        dto.setUrgencyLevel(entity.getUrgencyLevel());
        dto.setIncidentType(entity.getIncidentType());

        dto.setIncidentStatus(entity.getIncidentStatus());
        dto.setSpeciality(entity.getSpeciality());
        dto.setLocation(entity.getLocation());

        return dto;
    }

    public static Incident toEntity(IncidentDTO dto) {
        if (dto == null) return null;

        Incident incident = new Incident();

        incident.setId(dto.getId());
        incident.setName(dto.getName());
        incident.setDescription(dto.getDescription());

        incident.setPhotos(dto.getPhotos());
        incident.setSubmittedAt(dto.getSubmittedAt());
        incident.setCitizenId(dto.getCitizenId());

        incident.setAiEnabled(dto.getAiEnabled());
        incident.setAiConfidence(dto.getAiConfidence());
        incident.setAiPredictedName(dto.getAiPredictedName());

        incident.setIncidentType(dto.getIncidentType());
        incident.setIncidentStatus(dto.getIncidentStatus());
        incident.setSpeciality(dto.getSpeciality());

        incident.setLocation(dto.getLocation());
        incident.setAiPredictedUrgency(dto.getAiPredictedUrgency());
        incident.setUrgencyLevel(dto.getUrgencyLevel());

        return incident;
    }
}

