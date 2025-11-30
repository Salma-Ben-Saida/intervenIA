package tn.intervent360.intervent360.domain.model.planning;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Setter;
import lombok.Getter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document(collection = "plannings")
public class Planning {

    @Id
    @Setter @Getter
    private String id;

    @Setter @Getter
    private String incidentId; // reference to the incident being handled

    @Setter @Getter
    private Date startDate;
    @Setter @Getter
    private Date endDate;

    @Setter @Getter
    private PlanningStatus status;

    // Teams assigned
    @Setter @Getter
    private List<String> teamIds = new ArrayList<>();

    // Technicians assigned
    @Setter @Getter
    private List<String> technicianIds = new ArrayList<>();

    // Equipment allocated for this planning
    @Setter @Getter
    private List<String> equipmentIds = new ArrayList<>();


    // ============================
    //        CONSTRUCTORS
    // ============================

    public Planning() {
        this.id = UUID.randomUUID().toString();
    }

    public Planning(String incidentId, Date startDate, Date endDate) {
        this.id = UUID.randomUUID().toString();
        this.incidentId = incidentId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = PlanningStatus.SCHEDULED;
    }


    // ============================
    //        BUSINESS METHODS
    // ============================

    public void assignTeam(String teamId) {
        if (!teamIds.contains(teamId)) {
            teamIds.add(teamId);
        }
    }

    public void removeTeam(String teamId) {
        teamIds.remove(teamId);
    }

    public void assignTechnician(String technicianId) {
        if (!technicianIds.contains(technicianId)) {
            technicianIds.add(technicianId);
        }
    }

    public void removeTechnician(String technicianId) {
        technicianIds.remove(technicianId);
    }

    public void assignEquipment(String equipmentId) {
        if (!equipmentIds.contains(equipmentId)) {
            equipmentIds.add(equipmentId);
        }
    }

    public void removeEquipment(String equipmentId) {
        equipmentIds.remove(equipmentId);
    }

    public void markInProgress() {
        this.status = PlanningStatus.IN_PROGRESS;
    }

    public void markCompleted() {
        this.status = PlanningStatus.COMPLETED;
    }

    public void markCancelled() {
        this.status = PlanningStatus.CANCELLED;
    }

}

