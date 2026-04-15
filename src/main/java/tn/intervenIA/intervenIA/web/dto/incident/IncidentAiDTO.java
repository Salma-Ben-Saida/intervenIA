//DTO sent after AI classification.

package tn.intervenIA.intervenIA.web.dto.incident;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentName;

import java.util.List;

@Getter @Setter
public class IncidentAiDTO {

    private String description;       // Required for AI
    private List<String> photos;      // Optional but very useful
    private String citizenMessage;
    private IncidentName aiPredictedName;
    private Float aiConfidence;
}
