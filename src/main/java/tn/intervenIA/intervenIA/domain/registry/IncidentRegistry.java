package tn.intervenIA.intervenIA.domain.registry;

import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentName;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentType;
import tn.intervenIA.intervenIA.domain.model.incident.Location;
import tn.intervenIA.intervenIA.domain.model.incident.UrgencyLevel;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.*;

public class IncidentRegistry {

    // Primary map → IncidentName : Specialities
    private static final Map<IncidentName, List<ProfessionalSpeciality>> specialityMap = new HashMap<>();

    // Secondary map → IncidentName : default urgency
    private static final Map<IncidentName, UrgencyLevel> urgencyMap = new HashMap<>();


    static {

        // ============================
        // PUBLIC LIGHTING
        // ============================
        register(IncidentName.STREET_LIGHT_OUT, UrgencyLevel.MEDIUM,
                ProfessionalSpeciality.PUBLIC_LIGHTING);

        register(IncidentName.FLICKERING_LIGHT, UrgencyLevel.LOW,
                ProfessionalSpeciality.PUBLIC_LIGHTING);

        register(IncidentName.BROKEN_LIGHT_POLE, UrgencyLevel.HIGH,
                ProfessionalSpeciality.PUBLIC_LIGHTING);


        // ============================
        // ELECTRICITY
        // ============================
        register(IncidentName.POWER_OUTAGE, UrgencyLevel.HIGH,
                ProfessionalSpeciality.ELECTRICITY);

        register(IncidentName.ELECTRICAL_SPARK, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.ELECTRICITY, ProfessionalSpeciality.EMERGENCY);

        register(IncidentName.BROKEN_TRANSFORMER, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.ELECTRICITY, ProfessionalSpeciality.EMERGENCY);


        // ============================
        // TRAFFIC SIGNALS
        // ============================
        register(IncidentName.TRAFFIC_LIGHT_OUT, UrgencyLevel.HIGH,
                ProfessionalSpeciality.TRAFFIC_SIGNALS);

        register(IncidentName.PEDESTRIAN_LIGHT_OUT, UrgencyLevel.MEDIUM,
                ProfessionalSpeciality.TRAFFIC_SIGNALS);

        register(IncidentName.FAULTY_LED_PANEL, UrgencyLevel.LOW,
                ProfessionalSpeciality.TRAFFIC_SIGNALS);

        register(IncidentName.BROKEN_TRAFFIC_SIGNAL, UrgencyLevel.HIGH,
                ProfessionalSpeciality.TRAFFIC_SIGNALS);


        // ============================
        // WATERS & SANITATION
        // ============================
        register(IncidentName.WATER_LEAK, UrgencyLevel.MEDIUM,
                ProfessionalSpeciality.SANITATION);

        register(IncidentName.PIPE_BURST, UrgencyLevel.HIGH,
                ProfessionalSpeciality.SANITATION, ProfessionalSpeciality.EMERGENCY);

        register(IncidentName.SEWER_OVERFLOW, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.SANITATION, ProfessionalSpeciality.EMERGENCY);

        register(IncidentName.CLOGGED_DRAIN, UrgencyLevel.LOW,
                ProfessionalSpeciality.SANITATION);


        // ============================
        // ROADS
        // ============================
        register(IncidentName.POTHOLE, UrgencyLevel.LOW,
                ProfessionalSpeciality.ROADS);

        register(IncidentName.ROAD_DAMAGE, UrgencyLevel.MEDIUM,
                ProfessionalSpeciality.ROADS);

        register(IncidentName.BROKEN_SIDEWALK, UrgencyLevel.MEDIUM,
                ProfessionalSpeciality.ROADS);


        // ============================
        // ENVIRONMENT
        // ============================
        register(IncidentName.FALLEN_TREE, UrgencyLevel.HIGH,
                ProfessionalSpeciality.ENVIRONMENT, ProfessionalSpeciality.EMERGENCY);

        register(IncidentName.TRASH_OVERFLOW, UrgencyLevel.LOW,
                ProfessionalSpeciality.ENVIRONMENT);

        register(IncidentName.ILLEGAL_DUMPING, UrgencyLevel.LOW,
                ProfessionalSpeciality.ENVIRONMENT);


        // ============================
        // FIRE & SAFETY
        // ============================
        register(IncidentName.FIRE_START, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.FIRE_SAFETY, ProfessionalSpeciality.EMERGENCY);

        register(IncidentName.SMOKE_OBSERVATION, UrgencyLevel.HIGH,
                ProfessionalSpeciality.FIRE_SAFETY);

        register(IncidentName.EXPLOSION_RISK, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.FIRE_SAFETY, ProfessionalSpeciality.EMERGENCY);

        register(IncidentName.CHEMICAL_SMELL, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.FIRE_SAFETY, ProfessionalSpeciality.EMERGENCY);


        // ============================
        // GAS
        // ============================
        register(IncidentName.GAS_SMELL, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.GAZ, ProfessionalSpeciality.EMERGENCY);

        register(IncidentName.GAS_PIPE_LEAK, UrgencyLevel.CRITICAL,
                ProfessionalSpeciality.GAZ, ProfessionalSpeciality.EMERGENCY);


        // ============================
        // TELECOM & IOT
        // ============================
        register(IncidentName.CCTV_DOWN, UrgencyLevel.LOW,
                ProfessionalSpeciality.TELECOMMUNICATION_IOT);

        register(IncidentName.IOT_SENSOR_FAILURE, UrgencyLevel.LOW,
                ProfessionalSpeciality.TELECOMMUNICATION_IOT);

        register(IncidentName.FIBRE_OPTIC, UrgencyLevel.MEDIUM,
                ProfessionalSpeciality.TELECOMMUNICATION_IOT);


        // ============================
        // UNKNOWN
        // ============================
        register(IncidentName.UNKNOWN, UrgencyLevel.LOW,
                ProfessionalSpeciality.ENVIRONMENT); // fallback

    }


    // =======================================
    // Helper method for clean registration
    // =======================================
    private static void register(
            IncidentName name,
            UrgencyLevel urgency,
            ProfessionalSpeciality... specialities
    ) {
        specialityMap.put(name, Arrays.asList(specialities));
        urgencyMap.put(name, urgency);

    }


    // =======================================
    // PUBLIC ACCESSORS
    // =======================================

    public static List<ProfessionalSpeciality> getSpecialities(IncidentName name) {
        return specialityMap.getOrDefault(name, List.of());
    }

    public static UrgencyLevel getDefaultUrgency(IncidentName name) {
        return urgencyMap.getOrDefault(name, UrgencyLevel.MEDIUM);
    }
    public static IncidentType resolveIncidentType(UrgencyLevel urgencyLevel) {
        if (urgencyLevel == null) {
            return IncidentType.COMPLAINT; // fallback safe
        }

        return switch (urgencyLevel) {
            case CRITICAL -> IncidentType.EMERGENCY;
            case LOW -> IncidentType.COMPLAINT;
            // HIGH and MEDIUM are handled as intervention requests
            default -> IncidentType.INTERVENTION_REQUEST;
        };
    }

    public static Zone resolveZone(Location location) {
        double lat = location.getLat();

        if (lat >= 36.85)
            return Zone.NORTH;

        if (lat <= 36.70)
            return Zone.SOUTH;

        return Zone.CENTER;
    }

}
