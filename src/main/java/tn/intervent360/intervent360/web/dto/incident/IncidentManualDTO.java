//DTO for manually declared incidents.

package tn.intervent360.intervent360.web.dto.incident;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.incident.IncidentName;

import java.util.List;

@Getter @Setter
public class IncidentManualDTO {

    private IncidentName name;       // Citizen selects from list
    private String description;      // Required
    private List<String> photos;     // Optional
    private String citizenId;        // Authenticated user
    private Location location;       // Mandatory
    private Zone zone;
}
