//DTO used for sending Incident to frontend

package tn.intervent360.intervent360.web.dto.incident;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.incident.IncidentName;
import tn.intervent360.intervent360.domain.model.incident.IncidentStatus;
import tn.intervent360.intervent360.domain.model.incident.IncidentType;
import tn.intervent360.intervent360.domain.model.incident.UrgencyLevel;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.util.Date;
import java.util.List;

@Data
public class IncidentDTO {
    private String id;
    private IncidentName name;
    private String description;
    private List<String> photos;
    private Date submittedAt;
    private String citizenId;

    private Boolean aiEnabled;
    private Float aiConfidence;
    private IncidentName aiPredictedName;
    private UrgencyLevel aiPredictedUrgency;

    private UrgencyLevel urgencyLevel;
    private IncidentType incidentType;
    private IncidentStatus incidentStatus;
    private ProfessionalSpeciality speciality;

    private Location location;
    private Zone zone;
}

