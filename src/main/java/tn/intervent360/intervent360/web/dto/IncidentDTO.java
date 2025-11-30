package tn.intervent360.intervent360.web.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.incident.IncidentStatus;
import tn.intervent360.intervent360.domain.model.incident.IncidentType;
import tn.intervent360.intervent360.domain.model.incident.UrgencyLevel;

import java.util.List;

@Data
public class IncidentDTO {
    private String id;
    private String description;
    private List<String> photos;
    private Double lat;
    private Double lng;
    private String address;
    private String citizenId;
    private Boolean aiEnabled;
    private Float aiConfidence;
    private UrgencyLevel urgencyLevel;
    private IncidentType incidentType;
    private IncidentStatus incidentStatus;
}

