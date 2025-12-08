package tn.intervent360.intervent360.application.mapper.planning;

import tn.intervent360.intervent360.domain.model.planning.PlanningTechnician;
import tn.intervent360.intervent360.web.dto.planning.TechnicianDTO;

public class PlanningTechnicianMapper {

    public static TechnicianDTO toDTO(PlanningTechnician t) {
        TechnicianDTO dto = new TechnicianDTO();

        dto.setId(t.getTechnicianId());
        dto.setTeamId(t.getTeamId());
        dto.setSpeciality(t.getSpeciality());
        dto.setShiftStart(t.getShiftStart());
        dto.setShiftEnd(t.getShiftEnd());
        dto.setMaxDailyHours(t.getMaxDailyHours());
        dto.setAvailable(t.isAvailable());

        return dto;
    }
}
