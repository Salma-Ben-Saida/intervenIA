package tn.intervent360.intervent360.web.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentName;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentStatus;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentType;
import tn.intervent360.intervent360.domain.model.Location;

@Data
public class EquipmentDTO {
    private String id;
    private EquipmentName equipmentName;
    private EquipmentType equipmentType;
    private int quantity;
    private int inUse;
    private EquipmentStatus status;
    private Location location;
    private String model;
}

