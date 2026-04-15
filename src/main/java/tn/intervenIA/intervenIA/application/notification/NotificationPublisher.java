package tn.intervenIA.intervenIA.application.notification;

import tn.intervenIA.intervenIA.domain.model.planning.PlanningSolution;

public interface NotificationPublisher {
    void publish(PlanningSolution solution);
}
