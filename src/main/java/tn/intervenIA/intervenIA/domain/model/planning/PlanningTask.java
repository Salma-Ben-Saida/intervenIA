// ----------------------------
// PlanningTask.java
// ----------------------------
package tn.intervenIA.intervenIA.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentType;
import tn.intervenIA.intervenIA.domain.model.incident.UrgencyLevel;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.registry.SpecialityEquipmentRegistry;

import java.util.List;

@Getter
@Setter
public class PlanningTask {

    private String incidentId;
    private Zone zone;
    private List<ProfessionalSpeciality> requiredSpecialities;
    private int estimatedDurationHours;
    private int priority;
    private int earliestStartHour;
    private int deadlineHour;
    private List<String> requiredEquipment;
    private IncidentType incidentType;
    private UrgencyLevel urgencyLevel;

    public PlanningTask(String incidentId,
                        Zone zone,
                        List<ProfessionalSpeciality> requiredSpecialities,
                        int estimatedDurationHours,
                        int priority,
                        int earliestStart,
                        int deadline,
                        IncidentType incidentType,
                        UrgencyLevel urgencyLevel) {

        this.incidentId = incidentId;
        this.zone = zone;
        this.requiredSpecialities = requiredSpecialities;
        this.estimatedDurationHours = estimatedDurationHours;
        this.priority = priority;
        this.earliestStartHour = earliestStart;
        this.deadlineHour = deadline;
        this.requiredEquipment = SpecialityEquipmentRegistry.getEquipmentForAll(requiredSpecialities);
        this.incidentType = incidentType;
        this.urgencyLevel = urgencyLevel;
    }
}
