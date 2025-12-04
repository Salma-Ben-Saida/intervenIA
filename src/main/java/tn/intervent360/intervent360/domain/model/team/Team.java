package tn.intervent360.intervent360.domain.model.team;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervent360.intervent360.domain.model.Zone;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "teams")
public class Team {

    @Setter
    @Getter
    @Id
    private String id;

    @Setter
    @Getter
    private String name;

    // ID of the Leader (a User with Role.LEADER)
    @Setter
    @Getter
    private String leaderId;

    @Setter
    @Getter
    private ProfessionalSpeciality speciality;

    @Setter
    @Getter
    private Zone zone;

    // Store technician IDs rather than embedding full objects
    private final List<String> technicianIds = new ArrayList<>();


    // ============================
    //         CONSTRUCTORS
    // ============================
    public Team() {
        this.id = UUID.randomUUID().toString();
    }

    public Team(String leaderId,
                ProfessionalSpeciality speciality,
                Zone zone) {
        this.id = UUID.randomUUID().toString();
        this.leaderId = leaderId;
        this.speciality = speciality;
        this.zone = zone;
    }


    // ============================
    //         BUSINESS METHODS
    // ============================

    public void addTechnician(String technicianId) {
        if (!technicianIds.contains(technicianId)) {
            technicianIds.add(technicianId);
        }
    }

    public void removeTechnician(String technicianId) {
        technicianIds.remove(technicianId);
    }

    public List<String> getTechnicianIds() {
        return List.copyOf(technicianIds);
    }


}

