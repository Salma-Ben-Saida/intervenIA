//Represents teams that solver can pick from.
package tn.intervenIA.intervenIA.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.Zone;

import java.util.List;

@Getter @Setter
public class PlanningTeam {

    private String teamId;
    private String name;

    private ProfessionalSpeciality speciality;
    private Zone zone;

    private List<String> technicianIds =List.of();
}

