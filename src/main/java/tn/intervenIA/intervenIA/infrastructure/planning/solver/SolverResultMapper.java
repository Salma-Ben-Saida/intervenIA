package tn.intervenIA.intervenIA.infrastructure.planning.solver;

import tn.intervenIA.intervenIA.application.mapper.planning.PlanningAssignmentMapper;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningSolution;
import tn.intervenIA.intervenIA.web.dto.planning.AssignmentDTO;

import java.util.List;

public class SolverResultMapper {

    public static List<AssignmentDTO> toDTO(PlanningSolution sol) {
        return sol.getAssignments()
                .stream()
                .map(PlanningAssignmentMapper::toDTO)
                .toList();
    }
}
