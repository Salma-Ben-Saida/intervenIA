package tn.intervent360.intervent360.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.intervent360.intervent360.application.service.equipment.EquipmentService;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentStatus;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentType;
import tn.intervent360.intervent360.web.dto.EquipmentDTO;

import java.util.List;

@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    // ============================
    // CREATE
    // ============================
    @PostMapping
    public ResponseEntity<EquipmentDTO> createEquipment(@RequestBody EquipmentDTO dto) {
        return ResponseEntity.ok(equipmentService.create(dto));
    }

    // ============================
    // READ
    // ============================
    @GetMapping
    public ResponseEntity<List<EquipmentDTO>> findAllEquipments() {
        return ResponseEntity.ok(equipmentService.findAll());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<EquipmentDTO> getEquipmentById(@PathVariable String id) {
        return ResponseEntity.ok(equipmentService.findById(id));
    }

    @GetMapping("/quantity/greater-than/{amount}")
    public ResponseEntity<List<EquipmentDTO>> findByQuantityGreaterThan(@PathVariable int amount) {
        return ResponseEntity.ok(equipmentService.findByQuantityGreaterThan(amount));
    }

    @GetMapping("/quantity/equals/{amount}")
    public ResponseEntity<List<EquipmentDTO>> findByQuantityEquals(@PathVariable int amount) {
        return ResponseEntity.ok(equipmentService.findByQuantityEquals(amount));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EquipmentDTO>> findByStatus(@PathVariable EquipmentStatus status) {
        return ResponseEntity.ok(equipmentService.findByStatus(status));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<EquipmentDTO>> getByType(@PathVariable EquipmentType type) {
        return ResponseEntity.ok(equipmentService.findByEquipmentType(type));
    }

    // ============================
    // UPDATE
    // ============================
    @PutMapping("/{id}/increment")
    public ResponseEntity<EquipmentDTO> incrementStock(@PathVariable String id, @RequestParam int amount) {
        return ResponseEntity.ok(equipmentService.incrementStock(id, amount));
    }

    @PutMapping("/{id}/decrement")
    public ResponseEntity<EquipmentDTO> decrementStock(@PathVariable String id, @RequestParam int amount) {
        return ResponseEntity.ok(equipmentService.decrementStock(id, amount));
    }

    @PutMapping("/{id}/use")
    public EquipmentDTO use(@PathVariable String id, @RequestParam int amount) {
        return equipmentService.use(id, amount);
    }

    @PutMapping("/{id}/free")
    public EquipmentDTO free(@PathVariable String id, @RequestParam int amount) {
        return equipmentService.free(id, amount);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EquipmentDTO> updateStatus(@PathVariable String id, @RequestParam EquipmentStatus status) {
        return ResponseEntity.ok(equipmentService.updateStatus(id, status));
    }

    @PutMapping("/{id}/zone")
    public ResponseEntity<EquipmentDTO> updateZone(@PathVariable String id, @RequestBody Zone zone) {
        return ResponseEntity.ok(equipmentService.updateZone(id, zone));
    }

    // ============================
    // DELETE
    // ============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        equipmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

