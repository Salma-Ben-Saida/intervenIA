package tn.intervent360.intervent360.application.service.planning.expansion;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentName;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentRequirement;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentUsageType;
import tn.intervent360.intervent360.domain.model.incident.Incident;
import tn.intervent360.intervent360.domain.model.incident.IncidentStaffingRule;
import tn.intervent360.intervent360.domain.model.planning.PlanningTask;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.registry.EquipmentRegistry;
import tn.intervent360.intervent360.domain.registry.IncidentStaffingRegistry;
import tn.intervent360.intervent360.domain.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class TaskExpander {

    private final IncidentStaffingRegistry staffingRegistry;
    private final UserRepository userRepository;
    private final EquipmentRegistry equipmentRegistry;

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
            // equipment requirements PER SPECIALITY
            List<EquipmentRequirement> baseRequirements = equipmentRegistry.getRequirements(spec);

            // compute final quantities
            List<EquipmentRequirement> resolvedList = resolveEquipmentQuantities(baseRequirements, toAssign);

            // Convert List<EquipmentRequirement> → Map<EquipmentName, Integer>
            Map<EquipmentName, Integer> resolvedRequirements = resolvedList.stream()
                    .collect(Collectors.toMap(
                            EquipmentRequirement::getName,
                            EquipmentRequirement::getQuantity
                    ));

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
                t.setRequiredEquipment(resolvedRequirements);

                tasks.add(t);
            }
        }

        return tasks;
    }

    //Equipment quantity resolution logic

    private List<EquipmentRequirement> resolveEquipmentQuantities(
            List<EquipmentRequirement> base,
            int technicianCount
    ) {
        List<EquipmentRequirement> resolved = new ArrayList<>();

        for (EquipmentRequirement r : base) {

            EquipmentRequirement copy = new EquipmentRequirement();
            copy.setName(r.getName());
            copy.setUsageType(r.getUsageType());

            int qty =
                    r.getUsageType() == EquipmentUsageType.PER_TECHNICIAN
                            ? r.getQuantity() * technicianCount
                            : r.getQuantity();

            copy.setQuantity(qty);
            resolved.add(copy);
        }
        return resolved;
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
