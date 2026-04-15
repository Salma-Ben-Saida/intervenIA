package tn.intervenIA.intervenIA.application.service.planning;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.equipment.Equipment;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentRequirement;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningAssignment;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningSolution;
import tn.intervenIA.intervenIA.domain.repository.EquipmentRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanningFinalizerService {

    private final EquipmentRepository equipmentRepository;

    @Transactional
    public void commitSolution(PlanningSolution solution) {

        Map<String, List<PlanningAssignment>> byIncident =
                solution.getAssignments().stream()
                        .collect(Collectors.groupingBy(PlanningAssignment::getIncidentId));

        for (List<PlanningAssignment> assignmentsForIncident : byIncident.values()) {

            PlanningAssignment ref = assignmentsForIncident.get(0);

            List<EquipmentRequirement> equipmentUsed = ref.getEquipmentUsed();
            Zone incidentZone = ref.getZone();

            incrementEquipmentOnce(equipmentUsed, incidentZone);
        }

    }

    private void incrementEquipmentOnce(
            List<EquipmentRequirement> equipmentUsed,
            Zone incidentZone
    ) {
        for (EquipmentRequirement req : equipmentUsed) {

            List<Equipment> candidates =
                    equipmentRepository.findByEquipmentNameAndZone(
                            req.getName(),
                            incidentZone
                    );

            int remaining = req.getQuantity();

            for (Equipment eq : candidates) {
                int available = eq.getQuantity() - eq.getInUse();
                if (available <= 0) continue;

                int take = Math.min(available, remaining);
                eq.setInUse(eq.getInUse() + take);
                equipmentRepository.save(eq);

                remaining -= take;
                if (remaining == 0) break;
            }

            if (remaining > 0) {
                throw new IllegalStateException(
                        "Equipment shortage for " + req.getName()
                                + " in zone " + incidentZone
                );
            }
        }
    }

}
