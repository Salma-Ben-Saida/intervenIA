package tn.intervent360.intervent360.domain.model.equipment;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipmentRequirement {

    private EquipmentName name;

    // base quantity
    private int quantity;

    // how this quantity scales
    private EquipmentUsageType usageType;

    public int computeRequired(int technicianCount) {
        return switch (usageType) {
            case PER_TECHNICIAN -> quantity * technicianCount;
            case PER_MISSION   -> quantity;
        };
    }
}

