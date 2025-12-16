package tn.intervent360.intervent360.infrastructure.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import tn.intervent360.intervent360.application.notification.NotificationPublisher;
import tn.intervent360.intervent360.domain.model.planning.PlanningAssignment;
import tn.intervent360.intervent360.domain.model.planning.PlanningSolution;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class N8nNotificationPublisher implements NotificationPublisher {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String N8N_WEBHOOK_URL =
            "https://helloworlddxgxxxtfdufyf56.app.n8n.cloud/webhook-test/4cbc27ac-a5dc-4c7c-b691-ed5e62a62cb3";

    @Override
    public void publish(PlanningSolution solution) {

        Map<String, List<PlanningAssignment>> byIncident =
                solution.getAssignments().stream()
                        .collect(Collectors.groupingBy(PlanningAssignment::getIncidentId));

        for (var entry : byIncident.entrySet()) {

            NotificationPayload payload =
                    NotificationPayload.from(entry.getKey(), entry.getValue());

            restTemplate.postForEntity(
                    N8N_WEBHOOK_URL,
                    payload,
                    Void.class
            );
        }
    }
}
