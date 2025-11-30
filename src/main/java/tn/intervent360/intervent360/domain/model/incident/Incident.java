package tn.intervent360.intervent360.domain.model.incident;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.util.List;
import java.util.UUID;

@Document(collection = "incidents")
public class Incident {

    @Getter @Setter
    @Id
    private String id;

    @Getter @Setter
    private String description;   // Optional except when AI is enabled

    @Getter @Setter
    private List<String> photos;

    @Getter @Setter
    private String citizenId;

    @Getter @Setter
    private Boolean aiEnabled = false;

    @Getter @Setter
    private Float aiConfidence = 0f;

    @Getter @Setter
    private UrgencyLevel urgencyLevel;

    @Getter @Setter
    private IncidentType incidentType;

    @Getter @Setter
    private IncidentStatus incidentStatus = IncidentStatus.PENDING;

    @Getter @Setter
    private Location location;

    @Getter @Setter
    private ProfessionalSpeciality detectedCategory; // from AI or manual mapping


    // ============================
    //        CONSTRUCTORS
    // ============================

    public Incident() {
        this.id = UUID.randomUUID().toString();
    }

    public Incident(String description,
                    String citizenId,
                    IncidentType type,
                    Location location) {

        this.id = UUID.randomUUID().toString();
        this.description = description;
        this.citizenId = citizenId;
        this.incidentType = type;
        this.location = location;
        this.aiEnabled = false;
        this.aiConfidence = 0f;
    }


    // ============================
    //        BUSINESS METHODS
    // ============================

    public void classifyWithAI(Boolean enabled, Float confidence, ProfessionalSpeciality speciality) {
        this.aiEnabled = enabled;
        this.aiConfidence = confidence;
        this.detectedCategory = speciality;

        // When AI is enabled, validate description rule immediately
        if (enabled && (description == null || description.trim().isEmpty())) {
            throw new IllegalArgumentException(
                    "Description is required when AI classification is enabled."
            );
        }
    }

    public void setUrgency(UrgencyLevel level) {
        this.urgencyLevel = level;
    }

    public void updateStatus(IncidentStatus status) {
        this.incidentStatus = status;
    }

    /**
     * Validates the citizen-provided fields before inserting in DB.
     * RULES:
     * - Location is always required
     * - Description is required ONLY when AI is enabled
     */
    public void validateCitizenInput() {

        if (this.location == null) {
            throw new IllegalArgumentException("Location is required");
        }

        if (Boolean.TRUE.equals(aiEnabled)) {
            if (this.description == null || this.description.trim().isEmpty()) {
                throw new IllegalArgumentException(
                        "Description is required when AI mode is enabled"
                );
            }
        }
    }
}
