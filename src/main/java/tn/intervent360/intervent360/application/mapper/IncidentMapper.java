package tn.intervent360.intervent360.application.mapper;


import tn.intervent360.intervent360.domain.model.incident.*;
import tn.intervent360.intervent360.web.dto.incident.IncidentDTO;

import java.util.List;

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
        dto.setCitizenMessage(entity.getCitizenMessage());

        dto.setUrgencyLevel(entity.getUrgencyLevel());
        dto.setIncidentType(entity.getIncidentType());
        dto.setIncidentStatus(entity.getIncidentStatus());
        dto.setSpeciality(entity.getSpeciality());

        dto.setSpeciality(
                entity.getSpeciality() == null ? null :
                        List.copyOf(entity.getSpeciality())
        );

        dto.setZone(entity.getZone());
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
        incident.setCitizenMessage(dto.getCitizenMessage());

        incident.setUrgencyLevel(dto.getUrgencyLevel());
        incident.setIncidentType(dto.getIncidentType());
        incident.setIncidentStatus(dto.getIncidentStatus());
        incident.setSpeciality(
                dto.getSpeciality() == null ? null :
                        List.copyOf(dto.getSpeciality())
        );


        incident.setLocation(dto.getLocation());
        incident.setZone(dto.getZone());

        return incident;
    }
}

