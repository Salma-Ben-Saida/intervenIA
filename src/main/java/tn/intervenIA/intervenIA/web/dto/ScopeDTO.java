package tn.intervenIA.intervenIA.web.dto;

import lombok.Data;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

@Data
public class ScopeDTO {
    private Zone managedZone;
    private ProfessionalSpeciality managedSpeciality;
}
