package tn.intervenIA.intervenIA.application.service.incident;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.intervenIA.intervenIA.application.mapper.IncidentAiMapper;
import tn.intervenIA.intervenIA.application.mapper.IncidentMapper;
import tn.intervenIA.intervenIA.application.service.ai.AiConfidenceEvaluator;
import tn.intervenIA.intervenIA.application.service.ai.AiIncidentClassifier;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.incident.*;
import tn.intervenIA.intervenIA.web.dto.incident.CreateIncidentDTO;
import tn.intervenIA.intervenIA.domain.repository.IncidentRepository;
import tn.intervenIA.intervenIA.domain.registry.IncidentRegistry;
import tn.intervenIA.intervenIA.web.dto.incident.IncidentDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final AiIncidentClassifier aiClassifier;
    private final AiConfidenceEvaluator confidenceEvaluator;
    private final IncidentAiMapper aiMapper;
    // ============================================================
    //                INCIDENT CREATION
    // ============================================================
    public IncidentDTO createIncident(CreateIncidentDTO dto) {

        Incident incident;

        if (Boolean.TRUE.equals(dto.getAiEnabled())) {

            incident = new Incident(
                    dto.getDescription(),
                    dto.getPhotos(),
                    dto.getCitizenId(),
                    dto.getLocation(),
                    dto.getAiPredictedName(),   // prediction
                    dto.getAiConfidence(),
                    dto.getCitizenMessage()
            );

        } else {

            incident = new Incident(
                    dto.getFinalName(),
                    dto.getDescription(),
                    dto.getPhotos(),
                    dto.getCitizenId(),
                    dto.getLocation()
            );
        }

        // Compute zone
        incident.setZone(IncidentRegistry.resolveZone(dto.getLocation()));

        return IncidentMapper.toDTO(incidentRepository.save(incident));
    }



    // ============================================================
    //                GENERAL GETTERS
    // ============================================================

    public IncidentDTO getById(String id) {
        return incidentRepository.findById(id)
                .map(IncidentMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Incident not found"));
    }

    public List<IncidentDTO> getAll() {
        return incidentRepository.findAll()
                .stream()
                .map(IncidentMapper::toDTO)
                .toList();
    }

    public List<IncidentDTO> getByStatus(IncidentStatus status) {
        return incidentRepository.findByIncidentStatus(status)
                .stream()
                .map(IncidentMapper::toDTO)
                .toList();
    }

    public List<IncidentDTO> getByUrgency(UrgencyLevel level) {
        return incidentRepository.findByUrgencyLevel(level)
                .stream()
                .map(IncidentMapper::toDTO)
                .toList();
    }

    public List<IncidentDTO> findByIncidentType(IncidentType type) {
        return incidentRepository.findByIncidentType(type)
                .stream()
                .map(IncidentMapper::toDTO)
                .toList();
    }


    public List<IncidentDTO> findByCitizenId(String id) {
        return incidentRepository.findByCitizenId(id)
                .stream()
                .map(IncidentMapper::toDTO)
                .toList();
    }

    public List<IncidentDTO> findByZone(Zone zone) {
        return incidentRepository.findByZone(zone)
                .stream()
                .map(IncidentMapper::toDTO)
                .toList();
    }


    // ============================================================
    //                BUSINESS ACTIONS
    // ============================================================

    public IncidentDTO updateIncidentName(String id, IncidentName newName) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.updateIncidentName(newName);
        incident.setIncidentType(IncidentRegistry.resolveIncidentType(incident.getUrgencyLevel()));

        return IncidentMapper.toDTO(incidentRepository.save(incident));
    }

    public IncidentDTO updateUrgency(String id, UrgencyLevel level) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setUrgencyLevel(level);
        incident.setIncidentType(IncidentRegistry.resolveIncidentType(level));

        return IncidentMapper.toDTO(incidentRepository.save(incident));
    }

    public IncidentDTO updateStatus(String id, IncidentStatus status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setIncidentStatus(status);

        return IncidentMapper.toDTO(incidentRepository.save(incident));
    }

    public void deleteById(String id) {
        if(!incidentRepository.existsById(id))
            throw new IllegalArgumentException("Incident not found");

        incidentRepository.deleteById(id);
    }


}
