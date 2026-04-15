//FULL DTO used for sending Incident to frontend

package tn.intervenIA.intervenIA.web.dto.incident;

import lombok.Data;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.incident.Location;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentName;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentStatus;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentType;
import tn.intervenIA.intervenIA.domain.model.incident.UrgencyLevel;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

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
    private String citizenMessage;

    private UrgencyLevel urgencyLevel;
    private IncidentType incidentType;
    private IncidentStatus incidentStatus;
    private List<ProfessionalSpeciality> speciality;

    private Location location;
    private Zone zone;
}

