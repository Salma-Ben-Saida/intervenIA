package tn.intervent360.intervent360.application.mapper.planning;

import tn.intervent360.intervent360.domain.model.planning.PlanningAssignment;
import tn.intervent360.intervent360.web.dto.planning.AssignmentDTO;

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
