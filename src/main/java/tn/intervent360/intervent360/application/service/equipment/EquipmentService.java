package tn.intervent360.intervent360.application.service.equipment;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.application.mapper.EquipmentMapper;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.equipment.Equipment;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentStatus;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentType;
import tn.intervent360.intervent360.domain.repository.EquipmentRepository;
import tn.intervent360.intervent360.web.dto.EquipmentDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;

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
}
