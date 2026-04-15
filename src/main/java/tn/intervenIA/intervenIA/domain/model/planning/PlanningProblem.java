package tn.intervenIA.intervenIA.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.application.service.planning.expansion.ExpandedPlanningTask;

import java.time.Instant;
import java.util.List;

/**
 * The root domain object passed into the Choco solver.
 *
 * It contains:
 *  • A list of atomic ExpandedPlanningTask objects (each task = 1 speciality)
 *  • A list of PlanningTechnician (availability, speciality, zone)
 *  • A list of PlanningTeam (zone + speciality group)
 *
 * The solver reads ONLY this object.
 * It contains no business logic — just structured data.
 */
@Getter
@Setter
public class PlanningProblem {

    /**
     * Atomic tasks ready for constraint-solving.
     * Built by PlanningProblemBuilder + TaskExpander.
     */
    private List<ExpandedPlanningTask> tasks;

    /**
     * The technicians eligible for assignment.
     */
    private List<PlanningTechnician> technicians;

    /**
     * All teams in the city.
     * (Used only for validation & mapping results.)
     */
    private List<PlanningTeam> teams;

    /**
     * Total time horizon (default = 1 week = 168 hours).
     * The solver is allowed to pick a time between 0–167.
     */
    private int planningHorizonHours = 168;

    // Shared baseline for all tasks
    private Instant planningStart;
}
