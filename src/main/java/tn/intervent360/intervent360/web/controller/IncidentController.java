package tn.intervent360.intervent360.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.intervent360.intervent360.application.service.incident.IncidentService;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.incident.*;
import tn.intervent360.intervent360.web.dto.incident.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    // ============================================================
    //                MANUAL SUBMISSION
    // ============================================================

    @PostMapping("/manual")
    public ResponseEntity<IncidentDTO> submitManualIncident(@RequestBody IncidentManualDTO dto) {
        return ResponseEntity.ok(incidentService.submitManualIncident(dto));
    }

    // ============================================================
    //                AI SUBMISSION
    // ============================================================

    @PostMapping("/ai")
    public ResponseEntity<IncidentDTO> submitAiIncident(@RequestBody IncidentAiDTO dto) {
        return ResponseEntity.ok(incidentService.submitAiIncident(dto));
    }


    // ============================================================
    //                GETTERS
    // ============================================================

    @GetMapping
    public ResponseEntity<List<IncidentDTO>> getAll() {
        return ResponseEntity.ok(incidentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(incidentService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable String id) {
        incidentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<IncidentDTO>> getByStatus(@PathVariable IncidentStatus status) {
        return ResponseEntity.ok(incidentService.getByStatus(status));
    }

    @GetMapping("/urgency/{level}")
    public ResponseEntity<List<IncidentDTO>> getByUrgency(@PathVariable UrgencyLevel level) {
        return ResponseEntity.ok(incidentService.getByUrgency(level));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<IncidentDTO>> getByType(@PathVariable IncidentType type) {
        return ResponseEntity.ok(incidentService.findByIncidentType(type));
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<IncidentDTO>> getByCitizen(@PathVariable String citizenId) {
        return ResponseEntity.ok(incidentService.findByCitizenId(citizenId));
    }

    @PostMapping("/search/zone")
    public ResponseEntity<List<IncidentDTO>> getByZone(@RequestBody Zone zone) {
        return ResponseEntity.ok(incidentService.findByZone(zone));
    }


    // ============================================================
    //               BUSINESS ACTIONS
    // ============================================================

    @PutMapping("/{id}/name")
    public ResponseEntity<IncidentDTO> updateName(
            @PathVariable String id,
            @RequestParam IncidentName newName
    ) {
        return ResponseEntity.ok(incidentService.updateIncidentName(id, newName));
    }

    @PutMapping("/{id}/urgency")
    public ResponseEntity<IncidentDTO> updateUrgency(
            @PathVariable String id,
            @RequestParam UrgencyLevel level
    ) {
        return ResponseEntity.ok(incidentService.updateUrgency(id, level));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentDTO> updateStatus(
            @PathVariable String id,
            @RequestParam IncidentStatus status
    ) {
        return ResponseEntity.ok(incidentService.updateStatus(id, status));
    }

}
