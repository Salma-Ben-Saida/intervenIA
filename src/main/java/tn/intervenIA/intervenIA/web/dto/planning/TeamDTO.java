package tn.intervenIA.intervenIA.web.dto.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.List;

@Getter @Setter
public class TeamDTO {
    private String id;
    private String leaderId;
    private String name;

    private ProfessionalSpeciality speciality;
    private Zone zone;

    private List<String> technicianIds;
}

