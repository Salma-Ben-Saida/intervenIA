package tn.intervent360.intervent360.infrastructure.planning.solver;

import tn.intervent360.intervent360.application.mapper.planning.PlanningAssignmentMapper;
import tn.intervent360.intervent360.domain.model.planning.PlanningSolution;
import tn.intervent360.intervent360.web.dto.planning.AssignmentDTO;

import java.util.List;

public class SolverResultMapper {

    public static List<AssignmentDTO> toDTO(PlanningSolution sol) {
        return sol.getAssignments()
                .stream()
                .map(PlanningAssignmentMapper::toDTO)
                .toList();
    }
}
