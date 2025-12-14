package tn.intervent360.intervent360.domain.model.incident;

import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.util.List;

public record IncidentStaffingRule(
        int minTechs,
        int maxTechs,
        List<ProfessionalSpeciality> requiredSpecialities
) {}

