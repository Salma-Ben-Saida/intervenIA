package tn.intervent360.intervent360.web.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.intervent360.intervent360.application.service.planning.PlanningService;
import tn.intervent360.intervent360.infrastructure.planning.PlanningScheduler;
import tn.intervent360.intervent360.domain.model.planning.PlanningSolution;
import tn.intervent360.intervent360.domain.model.planning.PlanningAssignment;

import java.util.List;

/**
 * REST API layer for interacting with the planning module.
 *
 * Responsibilities:
 *   • Trigger weekly planning
 *   • Trigger emergency planning for a single incident
 *   • Query planning results
 *
 * This controller NEVER calls the solver directly.
 * It delegates to:
 *     - PlanningService   (orchestration)
 *     - PlanningScheduler (async triggers)
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/planning")
public class PlanningController {

    private final PlanningService planningService;
    private final PlanningScheduler scheduler;

    // ---------------------------------------------------------------------
    // TRIGGER PLANNING RUNS
    // ---------------------------------------------------------------------

    /**
     * MANUAL TRIGGER — Run the weekly full planning.
     */
    @PostMapping("/run-weekly")
    public ResponseEntity<PlanningSolution> runWeekly() {
        log.info("[REST] Manual weekly planning triggered.");
        PlanningSolution solution = planningService.runWeeklyPlanning();
        return ResponseEntity.ok(solution);
    }

    /**
     * MANUAL TRIGGER — Run emergency planning for one incident.
     */
    @PostMapping("/run-emergency/{incidentId}")
    public ResponseEntity<PlanningSolution> runEmergency(@PathVariable String incidentId) {
        log.info("[REST] Emergency planning triggered for incident {}", incidentId);
        PlanningSolution solution = planningService.runEmergencyPlanning(incidentId);
        return ResponseEntity.ok(solution);
    }

    /**
     * ASYNC TRIGGER — Runs weekly planning via scheduler.
     * Useful for UI buttons that should not block.
     */
    @PostMapping("/async/run-weekly")
    public ResponseEntity<String> runWeeklyAsync() {
        scheduler.nightlyPlanning();
        return ResponseEntity.accepted().body("Weekly planning triggered asynchronously.");
    }

    /**
     * ASYNC TRIGGER — Emergency through scheduler.
     */
    @PostMapping("/async/run-emergency/{incidentId}")
    public ResponseEntity<String> runEmergencyAsync(@PathVariable String incidentId) {
        scheduler.triggerEmergency(incidentId);
        return ResponseEntity.accepted().body("Emergency planning triggered asynchronously.");
    }

    // ---------------------------------------------------------------------
    // QUERY ASSIGNMENTS (stored in Mongo)
    // ---------------------------------------------------------------------

    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<List<PlanningAssignment>> getByIncident(@PathVariable String incidentId) {
        return ResponseEntity.ok(planningService.getAssignmentsForIncident(incidentId));
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<PlanningAssignment>> getByTechnician(@PathVariable String technicianId) {
        return ResponseEntity.ok(planningService.getAssignmentsForTechnician(technicianId));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<PlanningAssignment>> getByTeam(@PathVariable String teamId) {
        return ResponseEntity.ok(planningService.getAssignmentsForTeam(teamId));
    }
}
