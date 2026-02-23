package tn.intervent360.intervent360.domain.model.team;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervent360.intervent360.domain.model.Zone;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "teams")
@CompoundIndexes({
        @CompoundIndex(name = "team_spec_zone_idx", def = "{speciality:1, zone:1}")
})
public class Team {

    @Setter
    @Getter
    @Id
    private String id = UUID.randomUUID().toString();

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
    @Getter
    @Setter
    private List<String> technicianIds = new ArrayList<>();

    // ============================
    //         CONSTRUCTORS
    // ============================
    public Team() {
    }

    public Team(String leaderId,
                ProfessionalSpeciality speciality,
                Zone zone, List<String> technicianIds) {
        this.leaderId = leaderId;
        this.speciality = speciality;
        this.zone = zone;
        this.technicianIds.addAll(technicianIds);
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
}

