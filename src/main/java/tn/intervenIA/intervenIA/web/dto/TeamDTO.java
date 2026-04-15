package tn.intervenIA.intervenIA.web.dto;


import lombok.Data;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.Zone;

import java.util.List;

@Data
public class TeamDTO {
    private String id;
    private String leaderId;
    private ProfessionalSpeciality speciality;
    private Zone zone;
    private List<String> technicianIds;
}

