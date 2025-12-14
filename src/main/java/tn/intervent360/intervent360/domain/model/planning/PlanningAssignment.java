package tn.intervent360.intervent360.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.time.Instant;

/**
 * Represents one scheduled intervention assignment
 * for one speciality required by the incident.
 *
 * Example: EXPLOSION_RISK → FIRE_SAFETY + EMERGENCY
 * generates 2 PlanningAssignments.
 */
@Getter @Setter
public class PlanningAssignment {

    private String incidentId;

    // Which speciality this assignment fulfills
    private ProfessionalSpeciality speciality;

    private String teamId;
    private String technicianId;

    private Instant startTime;
    private Instant endTime;

    private PlanningStatus status = PlanningStatus.SCHEDULED;
}
