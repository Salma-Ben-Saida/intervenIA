package tn.intervent360.intervent360.web.dto.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

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

