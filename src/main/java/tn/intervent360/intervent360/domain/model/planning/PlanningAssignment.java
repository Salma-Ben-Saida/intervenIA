package tn.intervent360.intervent360.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentRequirement;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.time.Instant;
import java.util.List;

/**
 * Represents one scheduled intervention assignment
 * for one speciality required by the incident.
 *
 * Example: EXPLOSION_RISK → FIRE_SAFETY + EMERGENCY
 * generates 2 PlanningAssignments.
 */
@Getter @Setter
@Document(collection = "planningAssignment")
@CompoundIndexes({
        @CompoundIndex(def = "{'technicianId': 1, 'status': 1}"),
        @CompoundIndex(def = "{'incidentId': 1, 'status': 1}"),
        @CompoundIndex(def = "{'technicianId': 1, 'startTime': 1, 'endTime': 1}")
})
public class PlanningAssignment {

    @Id
    private String id;

    private String incidentId;

    // Which speciality this assignment fulfills
    private ProfessionalSpeciality speciality;

    private String teamId;
    private String technicianId;

    private Instant startTime;
    private Instant endTime;
    private Zone zone;


    private List<EquipmentRequirement> equipmentUsed;
    private PlanningStatus status = PlanningStatus.SCHEDULED;
}
