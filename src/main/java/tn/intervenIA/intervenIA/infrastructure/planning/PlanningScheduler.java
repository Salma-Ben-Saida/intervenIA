package tn.intervenIA.intervenIA.infrastructure.planning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tn.intervenIA.intervenIA.application.service.planning.EmergencyPlanningOrchestrator;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningProblem;
import tn.intervenIA.intervenIA.application.service.planning.builder.PlanningProblemBuilder;

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
