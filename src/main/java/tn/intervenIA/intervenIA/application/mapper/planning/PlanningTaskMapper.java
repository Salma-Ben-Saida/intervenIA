package tn.intervenIA.intervenIA.application.mapper.planning;

import tn.intervenIA.intervenIA.domain.model.planning.PlanningTask;
import tn.intervenIA.intervenIA.web.dto.planning.PlanningTaskDTO;

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
