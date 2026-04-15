package tn.intervenIA.intervenIA.web.dto;

import lombok.Data;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentName;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentStatus;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentType;

@Data
public class EquipmentDTO {
    private String id;
    private EquipmentName equipmentName;
    private EquipmentType equipmentType;
    private int quantity;
    private int inUse;
    private EquipmentStatus status;
    private Zone zone;
    private String model;
}

