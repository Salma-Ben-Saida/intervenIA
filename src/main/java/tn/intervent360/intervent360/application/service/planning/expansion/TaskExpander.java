package tn.intervent360.intervent360.application.service.planning.expansion;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Incident;
import tn.intervent360.intervent360.domain.model.incident.IncidentStaffingRule;
import tn.intervent360.intervent360.domain.model.planning.PlanningTask;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.registry.IncidentStaffingRegistry;
import tn.intervent360.intervent360.domain.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TaskExpander {

    private final IncidentStaffingRegistry staffingRegistry;
    private final UserRepository userRepository;

    /**
     * Expands ONE incident into N planning tasks
     */
    public List<ExpandedPlanningTask> expand(PlanningTask base, Incident incident) {

        IncidentStaffingRule rule =
                staffingRegistry.getRule(incident.getName());

        int availableTechs =
                countAvailableTechnicians(
                        incident.getZone(),
                        rule.requiredSpecialities()
                );
        if (availableTechs == 0) {
            return List.of(); // defer, escalate, or keep pending
        }


        // clamp: min ≤ assigned ≤ max
        int toAssign = Math.max(
                rule.minTechs(),
                Math.min(rule.maxTechs(), availableTechs)
        );

        List<ExpandedPlanningTask> tasks = new ArrayList<>();

        for (ProfessionalSpeciality spec : rule.requiredSpecialities()) {
            for (int i = 0; i < toAssign; i++) {


                ExpandedPlanningTask t = new ExpandedPlanningTask();

                t.setIncidentId(base.getIncidentId());
                t.setZone(base.getZone());
                t.setSpeciality(spec);
                t.setEstimatedDurationHours(base.getEstimatedDurationHours());
                t.setPriority(base.getPriority());
                t.setEarliestStartHour(base.getEarliestStartHour());
                t.setDeadlineHour(base.getDeadlineHour());
                t.setIncidentType(base.getIncidentType());
                t.setUrgencyLevel(base.getUrgencyLevel());
                t.setPriority(base.getPriority());

                tasks.add(t);
            }
        }

        return tasks;
    }

    /**
     * Counts how many technicians COULD realistically respond
     */
    private int countAvailableTechnicians(
            Zone zone,
            List<ProfessionalSpeciality> specialities
    ) {
        return  (int) userRepository.countByIsAvailableTrueAndSpecialityInAndTeam_Zone(
                specialities,
                zone

        );
    }
}
