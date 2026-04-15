// ----------------------------
// ExpandedPlanningTask.java
// ----------------------------
package tn.intervenIA.intervenIA.application.service.planning.expansion;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentName;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentType;
import tn.intervenIA.intervenIA.domain.model.incident.UrgencyLevel;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.Map;

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
    private IncidentType incidentType;
    private UrgencyLevel urgencyLevel;

    private Map<EquipmentName, Integer> requiredEquipment;



    public ExpandedPlanningTask() {}
}
