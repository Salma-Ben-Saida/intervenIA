package tn.intervenIA.intervenIA.application.service.planning;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.intervenIA.intervenIA.application.service.incident.IncidentService;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.equipment.Equipment;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentRequirement;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentStatus;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningAssignment;
import tn.intervenIA.intervenIA.domain.model.planning.PlanningStatus;
import tn.intervenIA.intervenIA.domain.repository.EquipmentRepository;
import tn.intervenIA.intervenIA.domain.repository.planning.PlanningAssignmentRepository;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlanningCompletionService {

    private final PlanningAssignmentRepository assignmentRepository;
    private final IncidentService incidentService;
    private final EquipmentRepository equipmentRepository;

    // ─── technician clicks "Start Task" ──────────────────────
    public PlanningAssignment startAssignment(String assignmentId) {

        PlanningAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));

        if (assignment.getStatus() != PlanningStatus.SCHEDULED) {
            throw new IllegalStateException("Assignment is not in SCHEDULED state");
        }

        assignment.setStatus(PlanningStatus.IN_PROGRESS);
        assignment.setStartTime(Instant.now());

        incidentService.updateStatus(
                assignment.getIncidentId(),
                IncidentStatus.IN_PROGRESS
        );

        log.info("Assignment {} started by technician {}",
                assignmentId, assignment.getTechnicianId());

        return assignmentRepository.save(assignment);
    }

    // ─── technician clicks "Mark Complete" ───────────────────
    @Transactional
    public PlanningAssignment completeAssignment(String assignmentId) {

        PlanningAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));

        if (assignment.getStatus() == PlanningStatus.COMPLETED) {
            throw new IllegalStateException("Assignment already completed");
        }
        if (assignment.getStatus() == PlanningStatus.CANCELLED) {
            throw new IllegalStateException("Cannot complete a cancelled assignment");
        }

        // 1. mark this assignment done
        assignment.setStatus(PlanningStatus.COMPLETED);
        assignment.setEndTime(Instant.now());
        PlanningAssignment saved = assignmentRepository.save(assignment);

        log.info("Assignment {} completed by technician {}",
                assignmentId, assignment.getTechnicianId());

        // 2. release equipment back to available pool
        releaseEquipment(saved);

        // 3. cascade: if ALL assignments for this incident are done
        //    → mark incident as COMPLETED
        boolean allDone = !assignmentRepository.existsByIncidentIdAndStatusNot(
                assignment.getIncidentId(),
                PlanningStatus.COMPLETED
        );

        if (allDone) {
            incidentService.updateStatus(
                    assignment.getIncidentId(),
                    IncidentStatus.COMPLETED
            );
            log.info("All assignments for incident {} completed — incident marked COMPLETED",
                    assignment.getIncidentId());
        }

        return saved;
    }

    // ─── releases equipment back to available pool ────────────

    protected void releaseEquipment(PlanningAssignment assignment) {

        Zone zone = assignment.getZone();
        List<EquipmentRequirement> equipmentUsed = assignment.getEquipmentUsed();

        if (equipmentUsed == null || equipmentUsed.isEmpty()) return;

        for (EquipmentRequirement req : equipmentUsed) {

            List<Equipment> candidates = equipmentRepository
                    .findByEquipmentNameAndZone(req.getName(), zone);

            int toRelease = req.getQuantity();

            for (Equipment eq : candidates) {
                if (eq.getInUse() <= 0) continue;
                int release = Math.min(eq.getInUse(), toRelease);
                eq.setInUse(eq.getInUse() - release);
                equipmentRepository.save(eq);
                toRelease -= release;
                if (toRelease == 0) break;
            }
        }
    }
}