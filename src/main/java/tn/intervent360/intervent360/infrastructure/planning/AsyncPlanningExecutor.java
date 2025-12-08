package tn.intervent360.intervent360.infrastructure.planning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.service.planning.PlanningService;
import tn.intervent360.intervent360.domain.model.planning.PlanningProblem;
import tn.intervent360.intervent360.domain.model.planning.PlanningSolution;

/**
 * Runs planning operations asynchronously.
 *
 * Responsibilities:
 *  -----------------------------
 *  • Trigger solver execution in the background
 *  • Log outcomes (success / infeasible)
 *  • Prevent blocking the HTTP thread or scheduler thread
 *
 * This is used for:
 *  • Nightly batch planning (scheduler)
 *  • Emergency instant planning
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AsyncPlanningExecutor {

    private final PlanningService planningService;

    /**
     * Executes the planning solver asynchronously using Spring's @Async executor.
     *
     * The "taskExecutor" bean must be configured in the app configuration.
     */
    @Async("taskExecutor")
    public void runAsync(PlanningProblem problem) {

        try {
            log.info("[ASYNC] Starting planning job… Tasks: {}", problem.getTasks().size());

            PlanningSolution solution = planningService.execute(problem);

            if (!solution.isFeasible()) {
                log.warn("[ASYNC] Planning FAILED → {}", solution.getSolverMessage());
            } else {
                log.info("[ASYNC] Planning SUCCESS → {} assignments saved",
                        solution.getAssignments().size());
            }

        } catch (Exception e) {
            log.error("[ASYNC] Planning crashed: {}", e.getMessage(), e);
        }
    }
}
