package tn.intervenIA.intervenIA.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.intervenIA.intervenIA.application.mapper.IncidentAiMapper;
import tn.intervenIA.intervenIA.application.service.ai.AiIncidentClassifier;
import tn.intervenIA.intervenIA.application.service.incident.IncidentService;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentName;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentStatus;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentType;
import tn.intervenIA.intervenIA.domain.model.incident.UrgencyLevel;
import tn.intervenIA.intervenIA.web.dto.incident.CreateIncidentDTO;
import tn.intervenIA.intervenIA.web.dto.incident.IncidentDTO;


import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;
    private final AiIncidentClassifier classifier;
    private final IncidentAiMapper mapper;

    // ============================================================
    //                Incident SUBMISSION
    // ============================================================

    @PostMapping("/create")
    public ResponseEntity<IncidentDTO> createIncident(@RequestBody CreateIncidentDTO dto) {
        return ResponseEntity.ok(incidentService.createIncident(dto));
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

    @GetMapping("/search/{zone}")
    public ResponseEntity<List<IncidentDTO>> getByZone(@PathVariable Zone zone) {
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
