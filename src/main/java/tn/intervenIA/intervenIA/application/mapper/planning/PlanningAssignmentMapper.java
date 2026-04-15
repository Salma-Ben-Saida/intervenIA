package tn.intervenIA.intervenIA.application.mapper.planning;

import tn.intervenIA.intervenIA.domain.model.planning.PlanningAssignment;
import tn.intervenIA.intervenIA.web.dto.planning.AssignmentDTO;

public class PlanningAssignmentMapper {

    public static AssignmentDTO toDTO(PlanningAssignment a) {
        AssignmentDTO dto = new AssignmentDTO();

        dto.setIncidentId(a.getIncidentId());
        dto.setSpeciality(a.getSpeciality());
        dto.setTeamId(a.getTeamId());
        dto.setTechnicianId(a.getTechnicianId());

        dto.setStartTime(a.getStartTime());
        dto.setEndTime(a.getEndTime());

        dto.setFeasible(true);
        return dto;
    }
}
