package tn.intervent360.intervent360.application.service.planning;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.notification.NotificationPublisher;
import tn.intervent360.intervent360.domain.model.planning.PlanningProblem;
import tn.intervent360.intervent360.domain.model.planning.PlanningSolution;

@Component
@RequiredArgsConstructor
public class EmergencyPlanningOrchestrator {

    private final PlanningService planningService;
    private final NotificationPublisher notificationPublisher;

    @Async("taskExecutor")
    public void handleEmergency(PlanningProblem problem) {

        PlanningSolution solution = planningService.execute(problem);

        if (!solution.isFeasible()) {
            return;
        }

        // 🔔 Notify people
        notificationPublisher.publish(solution);
    }
}

