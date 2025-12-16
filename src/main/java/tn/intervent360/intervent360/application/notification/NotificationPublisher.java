package tn.intervent360.intervent360.application.notification;

import tn.intervent360.intervent360.domain.model.planning.PlanningSolution;

public interface NotificationPublisher {
    void publish(PlanningSolution solution);
}
