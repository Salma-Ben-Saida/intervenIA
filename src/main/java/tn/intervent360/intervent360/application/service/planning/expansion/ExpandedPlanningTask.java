// ----------------------------
// ExpandedPlanningTask.java
// ----------------------------
package tn.intervent360.intervent360.application.service.planning.expansion;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.IncidentType;
import tn.intervent360.intervent360.domain.model.incident.UrgencyLevel;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.util.List;

@Getter
@Setter
public class ExpandedPlanningTask {

    private String incidentId;
    private ProfessionalSpeciality speciality;
    private Zone zone;
    private int estimatedDurationHours;
    private int priority;
    private int earliestStartHour;
    private int deadlineHour;
    private List<String> requiredEquipment;
    private IncidentType incidentType;
    private UrgencyLevel urgencyLevel;


    public ExpandedPlanningTask() {}
}
