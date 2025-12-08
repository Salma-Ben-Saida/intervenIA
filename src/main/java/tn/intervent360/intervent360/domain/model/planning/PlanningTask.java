//Represents an incident transformed into a planning problem.

package tn.intervent360.intervent360.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.registry.SpecialityEquipmentRegistry;

import java.util.List;

@Getter
@Setter
public class PlanningTask {

    private String incidentId;
    private Zone zone;

    // Example: [FIRE_SAFETY, EMERGENCY]
    private List<ProfessionalSpeciality> requiredSpecialities;

    private int estimatedDurationHours; // 1–4 hours typically
    private int priority; // Derived from urgency: CRITICAL = highest

    private long earliestStart; // timestamp or hour-slot
    private long deadline;      // deadline for handling (e.g., within 24h)

    private List<String> requiredEquipment;

    public PlanningTask(String incidentId,
                        Zone zone,
                        List<ProfessionalSpeciality> requiredSpecialities,
                        int estimatedDurationHours,
                        int priority,
                        long earliestStart,
                        long deadline) {

        this.incidentId = incidentId;
        this.zone = zone;
        this.requiredSpecialities = requiredSpecialities;
        this.estimatedDurationHours = estimatedDurationHours;
        this.priority = priority;
        this.earliestStart = earliestStart;
        this.deadline = deadline;

        // compute equipment
        this.requiredEquipment = SpecialityEquipmentRegistry
                .getEquipmentForAll(requiredSpecialities);
    }

}
