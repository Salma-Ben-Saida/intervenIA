package tn.intervenIA.intervenIA.domain.registry;

import org.springframework.stereotype.Component;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentName;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentStaffingRule;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class IncidentStaffingRegistry {

    private static final Map<IncidentName, IncidentStaffingRule> RULES =
            new EnumMap<>(IncidentName.class);

    static {

        // ============================
        // PUBLIC LIGHTING
        // ============================
        RULES.put(IncidentName.STREET_LIGHT_OUT,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.PUBLIC_LIGHTING)
                ));

        RULES.put(IncidentName.FLICKERING_LIGHT,
                new IncidentStaffingRule(
                        1, 1,
                        List.of(ProfessionalSpeciality.PUBLIC_LIGHTING)
                ));

        RULES.put(IncidentName.BROKEN_LIGHT_POLE,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(
                                ProfessionalSpeciality.PUBLIC_LIGHTING,
                                ProfessionalSpeciality.ROADS
                        )
                ));

        // ============================
        // ELECTRICITY
        // ============================
        RULES.put(IncidentName.POWER_OUTAGE,
                new IncidentStaffingRule(
                        2, 4,
                        List.of(ProfessionalSpeciality.ELECTRICITY)
                ));

        RULES.put(IncidentName.ELECTRICAL_SPARK,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(
                                ProfessionalSpeciality.ELECTRICITY,
                                ProfessionalSpeciality.FIRE_SAFETY
                        )
                ));

        RULES.put(IncidentName.BROKEN_TRANSFORMER,
                new IncidentStaffingRule(
                        3, 4,
                        List.of(
                                ProfessionalSpeciality.ELECTRICITY,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        // ============================
        // TRAFFIC SIGNALS
        // ============================
        RULES.put(IncidentName.TRAFFIC_LIGHT_OUT,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(
                                ProfessionalSpeciality.TRAFFIC_SIGNALS,
                                ProfessionalSpeciality.ELECTRICITY
                        )
                ));

        RULES.put(IncidentName.PEDESTRIAN_LIGHT_OUT,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.TRAFFIC_SIGNALS)
                ));

        RULES.put(IncidentName.FAULTY_LED_PANEL,
                new IncidentStaffingRule(
                        1, 1,
                        List.of(ProfessionalSpeciality.TRAFFIC_SIGNALS)
                ));

        RULES.put(IncidentName.BROKEN_TRAFFIC_SIGNAL,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(
                                ProfessionalSpeciality.TRAFFIC_SIGNALS,
                                ProfessionalSpeciality.ELECTRICITY
                        )
                ));

        // ============================
        // WATER & SANITATION
        // ============================
        RULES.put(IncidentName.WATER_LEAK,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.SANITATION)
                ));

        RULES.put(IncidentName.PIPE_BURST,
                new IncidentStaffingRule(
                        2, 4,
                        List.of(
                                ProfessionalSpeciality.SANITATION,
                                ProfessionalSpeciality.ROADS
                        )
                ));

        RULES.put(IncidentName.SEWER_OVERFLOW,
                new IncidentStaffingRule(
                        3, 5,
                        List.of(
                                ProfessionalSpeciality.SANITATION,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        RULES.put(IncidentName.CLOGGED_DRAIN,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.SANITATION)
                ));

        // ============================
        // ROADS
        // ============================
        RULES.put(IncidentName.POTHOLE,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.ROADS)
                ));

        RULES.put(IncidentName.ROAD_DAMAGE,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(ProfessionalSpeciality.ROADS)
                ));

        RULES.put(IncidentName.BROKEN_SIDEWALK,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(ProfessionalSpeciality.ROADS)
                ));

        // ============================
        // ENVIRONMENT
        // ============================
        RULES.put(IncidentName.FALLEN_TREE,
                new IncidentStaffingRule(
                        2, 4,
                        List.of(
                                ProfessionalSpeciality.ENVIRONMENT,
                                ProfessionalSpeciality.ROADS
                        )
                ));

        RULES.put(IncidentName.TRASH_OVERFLOW,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.ENVIRONMENT)
                ));

        RULES.put(IncidentName.ILLEGAL_DUMPING,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.ENVIRONMENT)
                ));

        // ============================
        // FIRE & SAFETY
        // ============================
        RULES.put(IncidentName.FIRE_START,
                new IncidentStaffingRule(
                        4, 6,
                        List.of(
                                ProfessionalSpeciality.FIRE_SAFETY,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        RULES.put(IncidentName.SMOKE_OBSERVATION,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(
                                ProfessionalSpeciality.FIRE_SAFETY,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        RULES.put(IncidentName.EXPLOSION_RISK,
                new IncidentStaffingRule(
                        3, 5,
                        List.of(
                                ProfessionalSpeciality.FIRE_SAFETY,
                                ProfessionalSpeciality.GAZ,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        RULES.put(IncidentName.CHEMICAL_SMELL,
                new IncidentStaffingRule(
                        2, 4,
                        List.of(
                                ProfessionalSpeciality.GAZ,
                                ProfessionalSpeciality.FIRE_SAFETY,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        // ============================
        // GAS
        // ============================
        RULES.put(IncidentName.GAS_SMELL,
                new IncidentStaffingRule(
                        2, 4,
                        List.of(
                                ProfessionalSpeciality.GAZ,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        RULES.put(IncidentName.GAS_PIPE_LEAK,
                new IncidentStaffingRule(
                        3, 4,
                        List.of(
                                ProfessionalSpeciality.GAZ,
                                ProfessionalSpeciality.EMERGENCY
                        )
                ));

        // ============================
        // TELECOMMUNICATION / IOT
        // ============================
        RULES.put(IncidentName.CCTV_DOWN,
                new IncidentStaffingRule(
                        1, 2,
                        List.of(ProfessionalSpeciality.TELECOMMUNICATION_IOT)
                ));

        RULES.put(IncidentName.IOT_SENSOR_FAILURE,
                new IncidentStaffingRule(
                        1, 1,
                        List.of(ProfessionalSpeciality.TELECOMMUNICATION_IOT)
                ));

        RULES.put(IncidentName.FIBRE_OPTIC,
                new IncidentStaffingRule(
                        2, 3,
                        List.of(ProfessionalSpeciality.TELECOMMUNICATION_IOT)
                ));
    }

    public IncidentStaffingRule getRule(IncidentName name) {
        return RULES.getOrDefault(
                name,
                new IncidentStaffingRule(
                        1, 1,
                        List.of(ProfessionalSpeciality.EMERGENCY)
                )
        );
    }
}
