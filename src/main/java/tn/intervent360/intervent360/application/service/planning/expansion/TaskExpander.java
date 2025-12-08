package tn.intervent360.intervent360.application.service.planning.expansion;

import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.domain.model.planning.PlanningTask;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.registry.SpecialityEquipmentRegistry;

import java.util.ArrayList;
import java.util.List;

/**
 * Expands a multi-speciality PlanningTask into a set of
 * atomic ExpandedPlanningTask elements.
 *
 * Example:
 *  PlanningTask for incident 123 requires:
 *      [FIRE_SAFETY, EMERGENCY]
 *
 * This class produces:
 *      - ExpandedPlanningTask(incident 123, FIRE_SAFETY)
 *      - ExpandedPlanningTask(incident 123, EMERGENCY)
 *
 * The solver operates only on expanded tasks.
 */

@Component
public class TaskExpander {

    /**
     * Expands one PlanningTask into N atomic tasks,
     * one per required speciality.
     */
    public List<ExpandedPlanningTask> expand(PlanningTask task) {

        List<ExpandedPlanningTask> expanded = new ArrayList<>();

        for (ProfessionalSpeciality speciality : task.getRequiredSpecialities()) {

            List<String> equipment =
                    SpecialityEquipmentRegistry.getEquipmentFor(speciality);

            ExpandedPlanningTask t = new ExpandedPlanningTask(
                    task.getIncidentId(),
                    speciality,
                    task.getZone(),
                    task.getEstimatedDurationHours(),
                    task.getPriority(),
                    task.getEarliestStart(),
                    task.getDeadline(),
                    equipment
            );

            expanded.add(t);
        }

        return expanded;
    }
}
