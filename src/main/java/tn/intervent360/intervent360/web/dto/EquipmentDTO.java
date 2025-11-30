package tn.intervent360.intervent360.web.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentStatus;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentType;

@Data
public class EquipmentDTO {
    private String id;
    private EquipmentType equipmentType;
    private EquipmentStatus status;
    private Double lat;
    private Double lng;
    private String address;
}

