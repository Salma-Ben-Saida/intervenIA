package tn.intervenIA.intervenIA.domain.model.incident;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.registry.IncidentRegistry;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Document(collection = "incidents")
public class Incident {

    @Id
    @Getter @Setter
    private String id = UUID.randomUUID().toString();

    @Getter @Setter
    private IncidentName name;

    @Getter @Setter
    private String description;

    @Getter @Setter
    private List<String> photos;

    @Getter @Setter
    private Date submittedAt = new Date();

    @Getter @Setter
    private String citizenId;

    @Getter @Setter
    private Boolean aiEnabled = false;

    @Getter @Setter
    private Float aiConfidence = 0f;

    @Getter @Setter
    private IncidentName aiPredictedName;

    @Getter @Setter @Indexed
    private UrgencyLevel urgencyLevel;

    @Getter @Setter
    private IncidentType incidentType;

    @Getter @Setter @Indexed
    private IncidentStatus incidentStatus = IncidentStatus.PENDING;

    @Getter @Setter
    private Location location;

    @Getter @Setter
    private Zone zone;

    @Getter @Setter @Indexed
    private List<ProfessionalSpeciality> speciality;

    @Getter @Setter
    private String citizenMessage;


    // =========================================================
    //            CONSTRUCTOR — MANUAL SUBMISSION
    // =========================================================
    public Incident(
            IncidentName name,
            String description,
            List<String> photos,
            String citizenId,
            Location location
    ) {
        this.name = name;
        this.description = description;
        this.photos = photos;
        this.citizenId = citizenId;
        this.location = location;

        // Resolve zone
        this.zone= IncidentRegistry.resolveZone(location);

        // Resolve speciality
        this.speciality = IncidentRegistry.getSpecialities(name);

        // Resolve urgency
        this.urgencyLevel = IncidentRegistry.getDefaultUrgency(name);

        // Resolve type
        this.incidentType = IncidentRegistry.resolveIncidentType(this.urgencyLevel);
    }

    // =========================================================
    //            CONSTRUCTOR — AI-BASED SUBMISSION
    // =========================================================
    public Incident(
            String description,
            List<String> photos,
            String citizenId,
            Location location,
            IncidentName aiPredictedName,
            Float aiConfidence,
            String citizenMessage
    ) {
        this.aiEnabled = true;

        this.description = description;
        this.photos = photos;
        this.citizenId = citizenId;
        this.location = location;

        // Resolve zone
        this.zone=IncidentRegistry.resolveZone(location);

        this.aiPredictedName = aiPredictedName;
        this.aiConfidence = aiConfidence;
        this.citizenMessage = citizenMessage;

        if (aiConfidence>=85){
            this.name=aiPredictedName;
            this.urgencyLevel=IncidentRegistry.getDefaultUrgency(aiPredictedName);
        }


        // Automatically infer incident type based on predicted urgency
        this.incidentType = IncidentRegistry.resolveIncidentType(this.urgencyLevel);

        // Predicted speciality
        this.speciality = IncidentRegistry.getSpecialities(aiPredictedName);
    }


    public Incident() {}


    // =========================================================
    //                       BUSINESS LOGIC
    // =========================================================

    public void escalateUrgency() {
        this.urgencyLevel = UrgencyLevel.CRITICAL;
    }

    public void confirmAIPrediction() {
        if (this.aiPredictedName != null) {
            this.name = this.aiPredictedName;

            this.speciality = IncidentRegistry.getSpecialities(aiPredictedName);

        }
    }

    public void updateIncidentName(IncidentName newName) {
        this.name = newName;

        this.speciality = IncidentRegistry.getSpecialities(newName);


        this.urgencyLevel = IncidentRegistry.getDefaultUrgency(newName);

        this.incidentType = IncidentRegistry.resolveIncidentType(this.urgencyLevel);
    }


}

