package tn.intervenIA.intervenIA.web.dto.incident;

import lombok.Data;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentName;
import tn.intervenIA.intervenIA.domain.model.incident.Location;

import java.util.List;

@Data
public class CreateIncidentDTO {
    private String description;
    private List<String> photos;
    private String citizenId;
    private Location location;

    private IncidentName finalName;      // chosen by user
    private Boolean aiEnabled;
    private Float aiConfidence;
    private IncidentName aiPredictedName;
    private String citizenMessage;        // optional storage
}

