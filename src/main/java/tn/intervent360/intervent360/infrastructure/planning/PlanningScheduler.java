package tn.intervent360.intervent360.infrastructure.planning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.service.planning.EmergencyPlanningOrchestrator;
import tn.intervent360.intervent360.domain.model.planning.PlanningProblem;
import tn.intervent360.intervent360.application.service.planning.builder.PlanningProblemBuilder;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlanningScheduler {

    private final AsyncPlanningExecutor asyncExecutor;
    private final PlanningProblemBuilder problemBuilder;
    private final EmergencyPlanningOrchestrator emergencyPlanningOrchestrator;

    /**
     * Runs every night at 2 AM.
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void nightlyPlanning() {
        log.info("Nightly planning started");

        PlanningProblem problem = problemBuilder.buildWeeklyProblem();
        asyncExecutor.runAsync(problem);
    }

    /**
     * Triggered manually for emergencies.
     */
    public void triggerEmergency(String incidentId) {
        PlanningProblem problem = problemBuilder.buildEmergencyProblem(incidentId);

        emergencyPlanningOrchestrator.handleEmergency(problem);
    }
}
