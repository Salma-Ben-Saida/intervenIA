package tn.intervenIA.intervenIA.domain.model.equipment;

import lombok.Setter;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.registry.EquipmentRegistry;

import java.util.UUID;

@Document(collection = "equipment")
@CompoundIndex(def = "{'equipmentName': 1, 'zone': 1, 'status': 1}")
public class Equipment {

    @Id
    @Getter @Setter
    private String id;

    @Indexed(unique = true)
    @Getter @Setter
    private String signature;

    @Getter @Setter
    private EquipmentName equipmentName;

    @Getter @Setter
    private int quantity;

    @Getter @Setter
    private int inUse;

    @Getter @Setter
    private EquipmentType equipmentType;

    @Getter @Setter
    private EquipmentStatus status;

    @Getter @Setter
    private String model;


    @Getter @Setter
    private Zone zone;


    // ============================
    //        CONSTRUCTORS
    // ============================

    public Equipment() {
        this.id = UUID.randomUUID().toString();
    }

    public Equipment(EquipmentName name, Zone zone, int  quantity) {
        this.id = UUID.randomUUID().toString();
        this.equipmentName = name;
        this.equipmentType = EquipmentRegistry.getType(name);
        this.quantity = quantity;
        this.zone = zone;
        this.status = EquipmentStatus.OPERATIONAL; // by default
        this.inUse = 0;
    }

    public Equipment(EquipmentName name, Zone zone, int  quantity, String  description) {
        this.id = UUID.randomUUID().toString();
        this.equipmentName = name;
        this.equipmentType = EquipmentRegistry.getType(name);
        this.quantity = quantity;
        this.zone = zone;
        this.model=description;
        this.status = EquipmentStatus.OPERATIONAL; // by default
        this.inUse = 0;
    }


    // ============================
    //       BUSINESS METHODS
    // ============================

    public void computeSignature() {

        this.signature =
                equipmentName.name() + "|" +
                        (model == null ? "" : model) + "|" +
                        zone;
    }


    public void incrementStock(int nb) {
        this.quantity += nb;
    }

    public void decrementStock(int amount) {
        if (this.quantity - amount < 0)
            throw new IllegalArgumentException("Not enough stock");
        this.quantity -= amount;
        if (this.quantity==0)
            this.status = EquipmentStatus.OUT_OF_SERVICE;
    }


    public boolean isOperational() {
        return this.status == EquipmentStatus.OPERATIONAL;
    }

    public boolean isAvailable() {
        return this.status == EquipmentStatus.OPERATIONAL ||
                this.status == EquipmentStatus.IN_VERIFICATION;
    }


}

