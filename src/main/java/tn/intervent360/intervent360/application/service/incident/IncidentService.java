package tn.intervent360.intervent360.application.service.incident;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.application.mapper.IncidentMapper;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.incident.*;
import tn.intervent360.intervent360.domain.repository.IncidentRepository;
import tn.intervent360.intervent360.domain.registry.IncidentRegistry;
import tn.intervent360.intervent360.web.dto.incident.*;
import tn.intervent360.intervent360.web.dto.incident.IncidentDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;

    // ============================================================
    //                MANUAL INCIDENT SUBMISSION
    // ============================================================
    public IncidentDTO submitManualIncident(IncidentManualDTO dto) {

        Incident incident = new Incident(
                dto.getName(),
                dto.getDescription(),
                dto.getPhotos(),
                dto.getCitizenId(),
                dto.getLocation()
        );

        // After constructor logic, compute type
        incident.setIncidentType(
                IncidentRegistry.resolveIncidentType(incident.getUrgencyLevel())
        );

        return IncidentMapper.toDTO(incidentRepository.save(incident));
    }


    // ============================================================
    //                AI-DRIVEN INCIDENT SUBMISSION
    // ============================================================
    public IncidentDTO submitAiIncident(IncidentAiDTO dto) {

        Incident incident = new Incident(
                dto.getDescription(),
                dto.getPhotos(),
                dto.getCitizenId(),
                dto.getLocation(),
                dto.getAiPredictedName(),
                dto.getAiConfidence(),
                dto.getAiPredictedUrgency()
        );

        // AI sets predicted urgency, now derive incidentType
        incident.setIncidentType(
                IncidentRegistry.resolveIncidentType(dto.getAiPredictedUrgency())
        );

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
