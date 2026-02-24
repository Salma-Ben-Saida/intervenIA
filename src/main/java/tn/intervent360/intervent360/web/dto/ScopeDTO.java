package tn.intervent360.intervent360.web.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

@Data
public class ScopeDTO {
    private Zone managedZone;
    private ProfessionalSpeciality managedSpeciality;
}
