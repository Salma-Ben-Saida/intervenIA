package tn.intervent360.intervent360.domain.model.incident;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.registry.IncidentRegistry;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.util.Collections;
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

    @Getter @Setter
    private UrgencyLevel urgencyLevel;

    @Getter @Setter
    private IncidentType incidentType;

    @Getter @Setter
    private IncidentStatus incidentStatus = IncidentStatus.PENDING;

    @Getter @Setter
    private Location location;

    @Getter @Setter
    private Zone zone;

    @Getter @Setter
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
        this.speciality = Collections.singletonList(IncidentRegistry.getSpecialities(name)
                .stream()
                .findFirst()
                .orElse(null));

        // Resolve urgency
        this.urgencyLevel = IncidentRegistry.getDefaultUrgency(name);

        // Resolve type
        this.incidentType = IncidentRegistry.resolveIncidentType(this.urgencyLevel);
    }

    // =========================================================
    //            Zone resolver method
    // =========================================================




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

        // Predicted speciality (not official)
        this.speciality = Collections.singletonList(IncidentRegistry.getSpecialities(aiPredictedName)
                .stream()
                .findFirst()
                .orElse(null));
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

            this.speciality = Collections.singletonList(IncidentRegistry.getSpecialities(this.aiPredictedName)
                    .stream()
                    .findFirst()
                    .orElse(null));
        }
    }

    public void updateIncidentName(IncidentName newName) {
        this.name = newName;

        this.speciality = Collections.singletonList(IncidentRegistry.getSpecialities(newName)
                .stream()
                .findFirst()
                .orElse(null));

        this.urgencyLevel = IncidentRegistry.getDefaultUrgency(newName);

        this.incidentType = IncidentRegistry.resolveIncidentType(this.urgencyLevel);
    }


}

