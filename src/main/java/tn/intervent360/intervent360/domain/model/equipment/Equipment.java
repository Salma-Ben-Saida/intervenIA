package tn.intervent360.intervent360.domain.model.equipment;

import lombok.Setter;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervent360.intervent360.domain.model.Location;
import tn.intervent360.intervent360.domain.registry.EquipmentTypeRegistry;

import java.util.UUID;

@Document(collection = "equipment")
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

    // Embedded location (no need for a separate collection)
    @GeoSpatialIndexed
    @Getter @Setter
    private Location location;


    // ============================
    //        CONSTRUCTORS
    // ============================

    public Equipment() {
        this.id = UUID.randomUUID().toString();
    }

    public Equipment(EquipmentName name, Location location, int  quantity) {
        this.id = UUID.randomUUID().toString();
        this.equipmentName = name;
        this.equipmentType = EquipmentTypeRegistry.getType(name);
        this.quantity = quantity;
        this.location = location;
        this.status = EquipmentStatus.OPERATIONAL; // by default
        this.inUse = 0;
    }

    public Equipment(EquipmentName name, Location location, int  quantity, String  description) {
        this.id = UUID.randomUUID().toString();
        this.equipmentName = name;
        this.equipmentType = EquipmentTypeRegistry.getType(name);
        this.quantity = quantity;
        this.location = location;
        this.model=description;
        this.status = EquipmentStatus.OPERATIONAL; // by default
        this.inUse = 0;
    }


    // ============================
    //       BUSINESS METHODS
    // ============================

    public void computeSignature() {
        if (location == null) {
            this.signature = equipmentName.name();
            return;
        }

        this.signature =
                equipmentName.name() + "|" +
                        (model == null ? "" : model) + "|" +
                        location.getLat() + "|" +
                        location.getLng() + "|" +
                        location.getAddress();
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
    public void incrementInUse(int amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Amount must be > 0");

        if (!isOperational())
            throw new IllegalStateException("Equipment must be operational to be used.");

        if (this.quantity - this.inUse < amount)
            throw new IllegalStateException("Not enough available items.");

        this.inUse += amount;

        if (this.inUse == this.quantity) {
            this.status = EquipmentStatus.OUT_OF_SERVICE;
        }
    }

    public void freeFromUse(int amount) {
        if (amount <= 0)
            throw new IllegalArgumentException("Amount must be > 0");

        if (this.inUse < amount)
            throw new IllegalStateException("Cannot free more items than in use.");

        this.inUse -= amount;

        if (this.inUse < this.quantity) {
            this.status = EquipmentStatus.OPERATIONAL;
        }
    }


    public boolean isOperational() {
        return this.status == EquipmentStatus.OPERATIONAL;
    }

    public boolean isAvailable() {
        return this.status == EquipmentStatus.OPERATIONAL ||
                this.status == EquipmentStatus.IN_VERIFICATION;
    }


}

