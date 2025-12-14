package tn.intervent360.intervent360.web.dto.planning;

import lombok.Setter;
import lombok.Getter;
import tn.intervent360.intervent360.domain.model.Zone;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class PlanningTaskDTO {

    private String incidentId;
    private Zone zone;

    private List<String> requiredSpecialities;
    private List<String> requiredEquipment;

    private int estimatedDurationHours;
    private int priority;
    private int earliestStart;
    private int deadline;
}
