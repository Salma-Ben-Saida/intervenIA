package tn.intervent360.intervent360.infrastructure.notification;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.planning.PlanningAssignment;

import java.time.Instant;
import java.util.List;

@Data
public class NotificationPayload {

    private String incidentId;
    private String teamId;
    private List<String> technicianIds;
    private Instant startTime;
    private String zone;
    private String speciality;

    public static NotificationPayload from(
            String incidentId,
            List<PlanningAssignment> assignments
    ) {

        PlanningAssignment first = assignments.get(0);

        NotificationPayload p = new NotificationPayload();
        p.incidentId = incidentId;
        p.teamId = first.getTeamId();
        p.zone = first.getZone().name();
        p.speciality = first.getSpeciality().name();
        p.startTime = first.getStartTime();

        p.technicianIds =
                assignments.stream()
                        .map(PlanningAssignment::getTechnicianId)
                        .toList();

        return p;
    }
}
