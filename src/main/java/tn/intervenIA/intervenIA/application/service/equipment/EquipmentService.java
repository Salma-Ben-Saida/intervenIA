package tn.intervenIA.intervenIA.application.service.equipment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import tn.intervenIA.intervenIA.application.mapper.EquipmentMapper;
import tn.intervenIA.intervenIA.application.service.planning.expansion.ExpandedPlanningTask;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.equipment.*;

import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.registry.EquipmentRegistry;
import tn.intervenIA.intervenIA.domain.repository.EquipmentRepository;
import tn.intervenIA.intervenIA.web.dto.EquipmentDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;

@Autowired
private EquipmentRegistry equipmentRegistry;

public boolean hasEnoughEquipment(
        List<ExpandedPlanningTask> tasks,
        Zone zone
) {
    if (tasks == null || tasks.isEmpty()) {
        return true;
    }
    
    String incidentId = tasks.get(0).getIncidentId();
    log.debug("Checking equipment for incident {} with {} tasks in zone {}", incidentId, tasks.size(), zone);
    
    // Step 1: Build required totals map
    Map<EquipmentName, Integer> requiredTotals = new HashMap<>();
    
    for (ExpandedPlanningTask task : tasks) {
        // Get equipment requirements from registry based on task speciality
        List<EquipmentRequirement> requirements = equipmentRegistry.getRequirements(task.getSpeciality());
        
        // Determine technician count for this task (assume 1 if not available)
        int technicianCount = 1; // TODO: This could be enhanced to get actual technician count
        
        log.debug("Processing task for specialty {} with {} technicians, {} requirements", 
                  task.getSpeciality(), technicianCount, requirements.size());
        
        for (EquipmentRequirement requirement : requirements) {
            // Compute required quantity respecting usage type
            int required = requirement.computeRequired(technicianCount);
            
            log.debug("Equipment {}: base quantity {}, usage type {}, computed required {}", 
                      requirement.getName(), requirement.getQuantity(), requirement.getUsageType(), required);
            
            // Add to totals (merge/sum if already exists)
            requiredTotals.merge(requirement.getName(), required, Integer::sum);
        }
    }
    
    if (requiredTotals.isEmpty()) {
        log.debug("No equipment requirements for incident {}", incidentId);
        return true;
    }
    
    log.debug("Total required equipment for incident {}: {}", incidentId, requiredTotals);
    
    // Step 2: Check availability for each required equipment
    for (Map.Entry<EquipmentName, Integer> entry : requiredTotals.entrySet()) {
        EquipmentName equipmentName = entry.getKey();
        int requiredQuantity = entry.getValue();
        
        // Query available equipment by zone and name, filtered by status
        List<Equipment> availableEquipment = equipmentRepository
                .findByEquipmentNameAndZone(equipmentName, zone);
        
        // Calculate total available quantity (only operational equipment)
        int availableCount = availableEquipment.stream()
                .filter(eq -> eq.getStatus() == EquipmentStatus.OPERATIONAL)
                .mapToInt(eq -> eq.getQuantity() - eq.getInUse()) // Available = total - in use
                .sum();
        
        log.debug("Equipment {} in zone {}: required {}, available {}", 
                  equipmentName, zone, requiredQuantity, availableCount);
        
        // Check if we have enough
        if (availableCount < requiredQuantity) {
            log.warn("Insufficient equipment for incident {}: {} required {}, available {} in zone {}", 
                     incidentId, equipmentName, requiredQuantity, availableCount, zone);
            
            // Log detailed breakdown for debugging
            log.debug("Equipment check failed - Equipment: {}, Required: {}, Available: {}, Zone: {}", 
                      equipmentName, requiredQuantity, availableCount, zone);
            
            return false;
        }
    }
    
    log.info("Equipment check passed for incident {} in zone {}: all {} equipment types satisfied", 
             incidentId, zone, requiredTotals.size());
    
    return true;
}

    // ===========================================================
    //                     BASIC CRUD
    // ===========================================================

    public EquipmentDTO create(EquipmentDTO dto) {
        Equipment eq = EquipmentMapper.toEntity(dto);

        eq.computeSignature();

        try {
            Equipment saved = equipmentRepository.save(eq);
            return EquipmentMapper.toDTO(saved);

        } catch (DuplicateKeyException e) {
            throw new IllegalArgumentException("Equipment already exists.");
        }
    }
    public List<EquipmentDTO> findByZone(Zone zone) {
        return equipmentRepository.findByZone(zone)
                .stream()
                .map(EquipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public EquipmentDTO findById(String id) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        return EquipmentMapper.toDTO(eq);
    }

    public List<EquipmentDTO> findAll() {
        return equipmentRepository.findAll()
                .stream()
                .map(EquipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<EquipmentDTO> findByEquipmentType(EquipmentType equipmentType) {
        return equipmentRepository.findByEquipmentType(equipmentType)
                .stream()
                .map(EquipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void delete(String id) {
        if (!equipmentRepository.existsById(id)) {
            throw new RuntimeException("Equipment not found");
        }
        equipmentRepository.deleteById(id);
    }

    public List<EquipmentDTO> findByQuantityGreaterThan(int amount){
        return equipmentRepository.findByQuantityGreaterThan(amount)
                .stream()
                .map(EquipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<EquipmentDTO> findByQuantityEquals(int amount){
        return equipmentRepository.findByQuantityEquals(amount)
                .stream()
                .map(EquipmentMapper::toDTO)
                .collect(Collectors.toList());
    }
    public List<EquipmentDTO> findByStatus(EquipmentStatus status){
        return equipmentRepository.findByStatus(status)
                .stream()
                .map(EquipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ===========================================================
    //             BUSINESS LOGIC — STOCK MANAGEMENT
    // ===========================================================

    /** Increase quantity */
    public EquipmentDTO incrementStock(String equipmentId, int amount) {
        Equipment eq = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        eq.incrementStock(amount);
        // If we add new stock → operational again (if not broken)
        if (eq.getStatus() == EquipmentStatus.OUT_OF_SERVICE && eq.getQuantity() > eq.getInUse()) {
            eq.setStatus(EquipmentStatus.OPERATIONAL);
        }
        return EquipmentMapper.toDTO(equipmentRepository.save(eq));
    }

    /** Decrease quantity */
    public EquipmentDTO decrementStock(String equipmentId, int amount) {
        Equipment eq = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if (eq.getQuantity() - amount < eq.getInUse())
            throw new IllegalArgumentException("Cannot reduce stock below the amount in use.");

        eq.decrementStock(amount);
        if (eq.getQuantity() == eq.getInUse()) {
            eq.setStatus(EquipmentStatus.OUT_OF_SERVICE);
        }
        return EquipmentMapper.toDTO(equipmentRepository.save(eq));
    }

    public EquipmentDTO use(String equipmentId, int amount) {
        Equipment eq = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        // Can only be used if operational
        if (eq.getStatus() != EquipmentStatus.OPERATIONAL) {
            throw new IllegalStateException("Equipment is not operational and cannot be used.");
        }

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        int available = eq.getQuantity() - eq.getInUse();
        if (available < amount)
            throw new IllegalArgumentException("Not enough available equipment to use.");

        // Update inUse counter
        eq.setInUse(eq.getInUse() + amount);

        return EquipmentMapper.toDTO(equipmentRepository.save(eq));
    }

    public EquipmentDTO free(String equipmentId, int amount) {
        Equipment eq = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        if (eq.getInUse() < amount) {
            throw new IllegalArgumentException("Cannot free more equipment than in use");
        }

        // Reduce usage count
        eq.setInUse(eq.getInUse() - amount);


        return EquipmentMapper.toDTO(equipmentRepository.save(eq));
    }



    // ===========================================================
    //             BUSINESS LOGIC — STATUS MANAGEMENT
    // ===========================================================

    public EquipmentDTO updateStatus(String equipmentId, EquipmentStatus status) {
        Equipment eq = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        eq.setStatus(status);
        return EquipmentMapper.toDTO(equipmentRepository.save(eq));
    }


    public EquipmentDTO updateZone(String id, Zone zone) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        eq.setZone(zone);
        return EquipmentMapper.toDTO(equipmentRepository.save(eq));
    }



    //Helper method for List conversion.
    public static List<EquipmentRequirement> toRequirements(
            Map<EquipmentName, Integer> map
    ) {
        return map.entrySet().stream().map(e -> {
            EquipmentRequirement r = new EquipmentRequirement();
            r.setName(e.getKey());
            r.setQuantity(e.getValue());
            return r;
        }).toList();
    }



}