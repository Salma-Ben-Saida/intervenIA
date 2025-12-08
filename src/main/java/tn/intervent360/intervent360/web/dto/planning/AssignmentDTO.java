package tn.intervent360.intervent360.web.dto.planning;

import lombok.Setter;
import lombok.Getter;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

@Getter
@Setter
public class AssignmentDTO {

    private String incidentId;
    private ProfessionalSpeciality speciality;

    private String teamId;
    private String technicianId;

    private long startTime;
    private long endTime;

    private boolean feasible;
}

