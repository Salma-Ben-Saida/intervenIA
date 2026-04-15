package tn.intervenIA.intervenIA.application.service.planning;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import tn.intervenIA.intervenIA.application.notification.NotificationPublisher;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningProblem;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningSolution;

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

