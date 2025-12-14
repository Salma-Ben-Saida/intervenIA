package tn.intervent360.intervent360.web.dto.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.time.Instant;

@Getter
@Setter
public class AssignmentDTO {

    private String incidentId;
    private ProfessionalSpeciality speciality;

    private String teamId;
    private String technicianId;

    private Instant startTime;  // use Instant instead of long
    private Instant endTime;    // use Instant instead of long

    private boolean feasible;
}
