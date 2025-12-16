package tn.intervent360.intervent360.application.service.planning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import tn.intervent360.intervent360.application.service.planning.builder.PlanningProblemBuilder;
import tn.intervent360.intervent360.domain.model.planning.*;
import tn.intervent360.intervent360.infrastructure.planning.solver.ChocoPlanningSolver;
import tn.intervent360.intervent360.domain.repository.planning.PlanningAssignmentRepository;

import java.util.List;

/**
 * Central orchestration layer for planning.
 *
 * Responsibilities:
 *  - Build a solver-ready PlanningProblem
 *  - Execute the solver (via ChocoPlanningSolver)
 *  - Persist solver assignments in Mongo DB
 *  - Expose query methods for retrieving planning results
 *
 * This service does NOT do scheduling or asynchronous execution.
 * That responsibility belongs to:
 *   - PlanningScheduler  (batch + emergency triggers)
 *   - AsyncPlanningExecutor (background execution)
 *
 * This service is pure business orchestration.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PlanningService {

    private final PlanningProblemBuilder problemBuilder;
    private final ChocoPlanningSolver solver;
    private final PlanningAssignmentRepository assignmentRepository;
    private final PlanningAssignmentRepository planningAssignmentRepository;
    private final PlanningFinalizerService finalizer;


    /**
     * Builds a new planning problem + solves it + persists the result.
     *
     * Used by:
     *   - nightly batch run
     *   - emergency manual trigger
     *
     * param incidents (optional) list of incidentIds or null (for full batch)
     */
    public PlanningSolution runWeeklyPlanning() {

        log.info("Building weekly planning problem…");

        PlanningProblem problem = problemBuilder.buildWeeklyProblem();
        PlanningSolution solution= execute(problem);

        if (solution.isFeasible()) {
            finalizer.commitSolution(solution);
        }
        return solution;
    }

    /**
     * Runs planning for a single emergency incident.
     */
    public PlanningSolution runEmergencyPlanning(String incidentId) {

        log.info("Building emergency planning problem for incident {}", incidentId);

        PlanningProblem problem = problemBuilder.buildEmergencyProblem(incidentId);
        PlanningSolution solution= execute(problem);

        if (solution.isFeasible()) {
            finalizer.commitSolution(solution);
        }
        return solution;
    }

    /**
     * Core execution pipeline:
     *   1) run solver
     *   2) check feasibility
     *   3) persist results in Mongo
     *   4) return full PlanningSolution
     */
    public PlanningSolution execute(PlanningProblem problem) {

        log.info("Running solver with {} tasks and {} technicians…",
                problem.getTasks().size(),
                problem.getTechnicians().size());

        PlanningSolution solution = solver.solve(problem);

        if (!solution.isFeasible()) {
            log.warn("Solver returned NO feasible solution: {}", solution.getSolverMessage());
            return solution;
        }

        log.info("Solver found {} assignments. Persisting…",
                solution.getAssignments().size());

        assignmentRepository.saveAll(solution.getAssignments());

        return solution;
    }

    // ============================================================
    // EXPOSED QUERY METHODS (for REST controllers)
    // ============================================================

    public List<PlanningAssignment> getAssignmentsForIncident(String incidentId) {
        return assignmentRepository.findByIncidentId(incidentId);
    }

    public List<PlanningAssignment> getAssignmentsForTechnician(String technicianId) {
        return assignmentRepository.findByTechnicianId(technicianId);
    }

    public List<PlanningAssignment> getAssignmentsForTeam(String teamId) {
        return assignmentRepository.findByTeamId(teamId);
    }
    public List<PlanningAssignment> getAllByStatusIs(PlanningStatus status) {
        return assignmentRepository.findAllByStatusIs(status);
    }

}
