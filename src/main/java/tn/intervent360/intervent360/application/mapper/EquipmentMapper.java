package tn.intervent360.intervent360.application.mapper;


import tn.intervent360.intervent360.domain.model.equipment.Equipment;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentStatus;
import tn.intervent360.intervent360.domain.registry.EquipmentRegistry;
import tn.intervent360.intervent360.web.dto.EquipmentDTO;
public class EquipmentMapper {

    public static EquipmentDTO toDTO(Equipment equipment) {
        if (equipment == null) return null;

        EquipmentDTO dto = new EquipmentDTO();
        dto.setId(equipment.getId());
        dto.setEquipmentType(equipment.getEquipmentType());
        dto.setStatus(equipment.getStatus());
        dto.setZone(equipment.getZone());
        dto.setModel(equipment.getModel());
        dto.setQuantity(equipment.getQuantity());
        dto.setEquipmentName(equipment.getEquipmentName());
        dto.setInUse(equipment.getInUse());

        return dto;
    }

    public static Equipment toEntity(EquipmentDTO dto) {
        if (dto == null) return null;

        Equipment equipment = new Equipment();
        equipment.setId(dto.getId());
        // Set equipmentType based on the name if not provided
        equipment.setEquipmentType(
                dto.getEquipmentType() != null ? dto.getEquipmentType() : EquipmentRegistry.getType(dto.getEquipmentName())
        );
        equipment.setStatus(
                dto.getStatus() != null ? dto.getStatus() : EquipmentStatus.OPERATIONAL
        );
        equipment.setZone(dto.getZone());
        equipment.setModel(dto.getModel());
        equipment.setQuantity(dto.getQuantity());
        equipment.setEquipmentName(dto.getEquipmentName());
        equipment.setInUse(dto.getInUse());
        return equipment;
    }
}

