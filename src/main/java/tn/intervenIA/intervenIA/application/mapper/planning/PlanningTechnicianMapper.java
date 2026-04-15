package tn.intervenIA.intervenIA.application.mapper.planning;

import tn.intervenIA.intervenIA.domain.model.planning.PlanningTechnician;
import tn.intervenIA.intervenIA.web.dto.planning.TechnicianDTO;

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
