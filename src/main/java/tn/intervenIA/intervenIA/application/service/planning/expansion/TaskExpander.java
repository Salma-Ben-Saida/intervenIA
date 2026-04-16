package tn.intervenIA.intervenIA.application.service.planning.expansion;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentName;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentRequirement;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentUsageType;
import tn.intervenIA.intervenIA.domain.model.incident.Incident;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentStaffingRule;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningTask;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.team.Team;
import tn.intervenIA.intervenIA.domain.model.user.Role;
import tn.intervenIA.intervenIA.domain.registry.EquipmentRegistry;
import tn.intervenIA.intervenIA.domain.registry.IncidentStaffingRegistry;
import tn.intervenIA.intervenIA.domain.repository.TeamRepository;
import tn.intervenIA.intervenIA.domain.repository.UserRepository;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TaskExpander {

    private final IncidentStaffingRegistry staffingRegistry;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
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
            log.warn("No technicians found for zone {}. Keeping incident for solver anyway.", incident.getZone());
            availableTechs = 1; // fallback so solver still works
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
        List<String> teamIds = teamRepository.findByZone(zone)
                .stream()
                .map(Team::getId)
                .toList();

        return userRepository.countByTeamIdInAndIsAvailableAndRole(
                teamIds,
                true,
                Role.TECHNICIAN
        );
    }
}
