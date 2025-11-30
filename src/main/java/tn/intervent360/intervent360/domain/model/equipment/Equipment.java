package tn.intervent360.intervent360.domain.model.equipment;

import lombok.Setter;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervent360.intervent360.domain.model.incident.Location;

import java.util.UUID;

@Document(collection = "equipment")
public class Equipment {

    @Id
    @Getter @Setter
    private String id;

    @Getter @Setter
    private EquipmentType equipmentType;
    @Getter @Setter
    private EquipmentStatus status;

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

    public Equipment(EquipmentType equipmentType, Location location) {
        this.id = UUID.randomUUID().toString();
        this.equipmentType = equipmentType;
        this.location = location;
        this.status = EquipmentStatus.OPERATIONAL; // default
    }


    // ============================
    //       BUSINESS METHODS
    // ============================

    public void markAsBroken() {
        this.status = EquipmentStatus.BROKEN;
    }

    public void markAsUnderRepair() {
        this.status = EquipmentStatus.UNDER_REPAIR;
    }

    public void markAsOperational() {
        this.status = EquipmentStatus.OPERATIONAL;
    }

    public boolean isOperational() {
        return this.status == EquipmentStatus.OPERATIONAL;
    }

    public boolean isAvailable() {
        return this.status == EquipmentStatus.OPERATIONAL ||
                this.status == EquipmentStatus.IN_VERIFICATION;
    }


}

