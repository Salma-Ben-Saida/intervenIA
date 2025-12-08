package tn.intervent360.intervent360.application.service.planning.expansion;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.util.List;

/**
 * Represents an atomic task that must be scheduled by the solver.
 * One ExpandedPlanningTask corresponds to exactly ONE required speciality
 * of an incident.
 *
 * If an incident requires multiple specialities (e.g., FIRE_SAFETY + EMERGENCY),
 * this class produces one task per speciality.
 *
 * It contains all information needed for the solver to assign:
 * - One technician
 * - One team
 * - One timeslot
 */
@Getter
@Setter
public class ExpandedPlanningTask {

    private String incidentId;

    private ProfessionalSpeciality speciality; // ONE speciality only
    private Zone zone;

    private int estimatedDurationHours;
    private int priority;

    private long earliestStart;
    private long deadline;

    // equipment for this specific speciality
    private List<String> requiredEquipment;

    public ExpandedPlanningTask(String incidentId,
                                ProfessionalSpeciality speciality,
                                Zone zone,
                                int estimatedDurationHours,
                                int priority,
                                long earliestStart,
                                long deadline,
                                List<String> requiredEquipment) {

        this.incidentId = incidentId;
        this.speciality = speciality;
        this.zone = zone;
        this.estimatedDurationHours = estimatedDurationHours;
        this.priority = priority;
        this.earliestStart = earliestStart;
        this.deadline = deadline;
        this.requiredEquipment = requiredEquipment;
    }
}
