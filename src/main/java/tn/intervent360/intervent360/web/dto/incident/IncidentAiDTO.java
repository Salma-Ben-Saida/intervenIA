//DTO sent after AI classification.

package tn.intervent360.intervent360.web.dto.incident;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.incident.IncidentName;
import tn.intervent360.intervent360.domain.model.incident.UrgencyLevel;

import java.util.List;

@Getter @Setter
public class IncidentAiDTO {

    private String description;       // Required for AI
    private List<String> photos;      // Optional but very useful
    private String citizenMessage;
    private IncidentName aiPredictedName;
    private Float aiConfidence;
}
