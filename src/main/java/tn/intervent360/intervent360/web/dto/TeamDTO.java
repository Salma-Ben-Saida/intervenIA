package tn.intervent360.intervent360.web.dto;


import lombok.Data;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Zone;

import java.util.List;

@Data
public class TeamDTO {
    private String id;
    private String name;
    private String chefId;
    private ProfessionalSpeciality speciality;
    private Zone zone;
    private List<String> technicianIds;
}

