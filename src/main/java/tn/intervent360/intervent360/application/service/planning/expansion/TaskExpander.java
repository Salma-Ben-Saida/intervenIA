package tn.intervent360.intervent360.application.service.planning.expansion;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentName;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentRequirement;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentUsageType;
import tn.intervent360.intervent360.domain.model.incident.Incident;
import tn.intervent360.intervent360.domain.model.incident.IncidentStaffingRule;
import tn.intervent360.intervent360.domain.model.planning.PlanningTask;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Team;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.registry.EquipmentRegistry;
import tn.intervent360.intervent360.domain.registry.IncidentStaffingRegistry;
import tn.intervent360.intervent360.domain.repository.TeamRepository;
import tn.intervent360.intervent360.domain.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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

        List<ExpandedPlanningTask> tasks = new ArrayList<>();

        // Optional: batch teams per zone/specialities to reduce DB calls
        Map<ProfessionalSpeciality, List<String>> teamIdsBySpec = new HashMap<>();
        // Fallback to per-speciality fetch if batch method is not supported by underlying DB
        try {
            List<Team> teams = teamRepository.findByZoneAndSpecialityIn(incident.getZone(), rule.requiredSpecialities());
            Map<ProfessionalSpeciality, List<String>> grouped = teams.stream().collect(Collectors.groupingBy(Team::getSpeciality, Collectors.mapping(Team::getId, Collectors.toList())));
            teamIdsBySpec.putAll(grouped);
        } catch (Exception e) {
            // If repository implementation does not support this query, do per-speciality fetch below
        }

        for (ProfessionalSpeciality spec : rule.requiredSpecialities()) {
            // Resolve team IDs for this speciality & zone
            List<String> teamIds = teamIdsBySpec.get(spec);
            if (teamIds == null) {
                teamIds = teamRepository.findBySpecialityAndZone(spec, incident.getZone())
                        .stream().map(Team::getId).toList();
            }

            if (teamIds.isEmpty()) {
                log.warn("No teams found for speciality {} in zone {} for incident {}", spec, incident.getZone(), base.getIncidentId());
                continue;
            }

            int available = (int) userRepository.countByTeamIdInAndIsAvailableAndRole(teamIds, true, Role.TECHNICIAN);

            if (available == 0) {
                log.warn("No available technicians for speciality {} in zone {} for incident {}", spec, incident.getZone(), base.getIncidentId());
                continue;
            }

            int toAssign = Math.max(rule.minTechs(), Math.min(rule.maxTechs(), available));

            // equipment requirements PER SPECIALITY
            List<EquipmentRequirement> baseRequirements = equipmentRegistry.getRequirements(spec);

            // compute final quantities for this speciality's technician count
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
        // Collect all team IDs that match any of the required specialities in the given zone
        Set<String> teamIds = new HashSet<>();
        for (ProfessionalSpeciality spec : specialities) {
            List<Team> teams = teamRepository.findBySpecialityAndZone(spec, zone);
            for (Team t : teams) {
                teamIds.add(t.getId());
            }
        }
        if (teamIds.isEmpty()) {
            return 0;
        }
        // Query users by these team IDs, availability and role TECHNICIAN
        return userRepository
                .findByTeamIdInAndIsAvailableAndRole(new ArrayList<>(teamIds), true, Role.TECHNICIAN)
                .size();
    }
}
