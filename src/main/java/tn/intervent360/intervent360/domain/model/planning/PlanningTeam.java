//Represents teams that solver can pick from.
package tn.intervent360.intervent360.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.Zone;

import java.util.List;

@Getter @Setter
public class PlanningTeam {

    private String teamId;
    private String name;

    private ProfessionalSpeciality speciality;
    private Zone zone;

    private List<String> technicianIds =List.of();
}

