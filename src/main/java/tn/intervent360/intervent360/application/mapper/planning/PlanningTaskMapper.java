package tn.intervent360.intervent360.application.mapper.planning;

import tn.intervent360.intervent360.domain.model.planning.PlanningTask;
import tn.intervent360.intervent360.web.dto.planning.PlanningTaskDTO;

public class PlanningTaskMapper {

    public static PlanningTaskDTO toDTO(PlanningTask task) {
        PlanningTaskDTO dto = new PlanningTaskDTO();

        dto.setIncidentId(task.getIncidentId());
        dto.setZone(task.getZone());

        dto.setRequiredSpecialities(
                task.getRequiredSpecialities()
                        .stream()
                        .map(Enum::name)
                        .toList()
        );

        dto.setRequiredEquipment(task.getRequiredEquipment());
        dto.setEstimatedDurationHours(task.getEstimatedDurationHours());
        dto.setPriority(task.getPriority());

        // Use Instant fields now
        dto.setEarliestStart(task.getEarliestStartHour());
        dto.setDeadline(task.getDeadlineHour());

        return dto;
    }
}
