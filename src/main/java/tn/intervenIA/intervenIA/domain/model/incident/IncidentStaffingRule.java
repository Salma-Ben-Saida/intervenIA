package tn.intervenIA.intervenIA.domain.model.incident;

import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.List;

public record IncidentStaffingRule(
        int minTechs,
        int maxTechs,
        List<ProfessionalSpeciality> requiredSpecialities
) {}

