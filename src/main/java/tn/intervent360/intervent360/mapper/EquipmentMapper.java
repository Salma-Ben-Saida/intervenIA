package tn.intervent360.intervent360.mapper;


import tn.intervent360.intervent360.domain.model.equipment.Equipment;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.dto.EquipmentDTO;
public class EquipmentMapper {

    public static EquipmentDTO toDTO(Equipment equipment) {
        if (equipment == null) return null;

        EquipmentDTO dto = new EquipmentDTO();
        dto.setId(equipment.getId());
        dto.setEquipmentType(equipment.getEquipmentType());
        dto.setStatus(equipment.getStatus());
        dto.setLat(equipment.getLocation() != null ? equipment.getLocation().getLat() : null);
        dto.setLng(equipment.getLocation() != null ? equipment.getLocation().getLng() : null);
        dto.setAddress(equipment.getLocation() != null ? equipment.getLocation().getAddress() : null);

        return dto;
    }

    public static Equipment toEntity(EquipmentDTO dto) {
        if (dto == null) return null;

        Equipment equipment = new Equipment();
        equipment.setId(dto.getId());
        equipment.setEquipmentType(dto.getEquipmentType());
        equipment.setStatus(dto.getStatus());

        if (dto.getLat() != null && dto.getLng() != null) {
            Location location = new Location(dto.getLat(), dto.getLng(),  dto.getAddress());
            equipment.setLocation(location);
        }

        return equipment;
    }
}

