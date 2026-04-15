package tn.intervenIA.intervenIA.domain.model.incident;

public enum IncidentName {

    // ============================
    // PUBLIC LIGHTING
    // ============================
    STREET_LIGHT_OUT,        // MEDIUM – impacts safety but not urgent
    FLICKERING_LIGHT,        // LOW – nuisance but not dangerous
    BROKEN_LIGHT_POLE,       // HIGH – risk of falling

    // ============================
    // ELECTRICITY
    // ============================
    POWER_OUTAGE,            // HIGH – affects safety & services
    ELECTRICAL_SPARK,        // CRITICAL – electrocution / fire risk
    BROKEN_TRANSFORMER,      // CRITICAL – explosion / blackout risk

    // ============================
    // TRAFFIC SIGNALS
    // ============================
    TRAFFIC_LIGHT_OUT,       // HIGH – accident risk
    PEDESTRIAN_LIGHT_OUT,    // MEDIUM – risk for pedestrians
    FAULTY_LED_PANEL,        // LOW – informational system only
    BROKEN_TRAFFIC_SIGNAL,   // HIGH – accident risk

    // ============================
    // WATER & SANITATION
    // ============================
    WATER_LEAK,              // MEDIUM – loss of water
    PIPE_BURST,              // HIGH – flooding and infrastructure damage
    SEWER_OVERFLOW,          // CRITICAL – contamination risk
    CLOGGED_DRAIN,           // LOW – nuisance except in rainy season (MEDIUM)

    // ============================
    // ROADS
    // ============================
    POTHOLE,                 // LOW – typical maintenance
    ROAD_DAMAGE,             // MEDIUM – structural damage
    BROKEN_SIDEWALK,         // MEDIUM – pedestrian safety

    // ============================
    // ENVIRONMENT
    // ============================
    FALLEN_TREE,             // HIGH – blocks roads & danger
    TRASH_OVERFLOW,          // LOW – hygiene concern
    ILLEGAL_DUMPING,         // LOW – environmental but not urgent

    // ============================
    // FIRE & SAFETY
    // ============================
    FIRE_START,              // CRITICAL – immediate danger
    SMOKE_OBSERVATION,       // HIGH – probable fire
    EXPLOSION_RISK,          // CRITICAL – extreme danger
    CHEMICAL_SMELL,          // CRITICAL – toxic leak risk

    // ============================
    // GAS
    // ============================
    GAS_SMELL,               // CRITICAL – explosion risk
    GAS_PIPE_LEAK,           // CRITICAL – direct danger

    // ============================
    // TELECOMMUNICATION / IOT
    // ============================
    CCTV_DOWN,               // LOW – security impact
    IOT_SENSOR_FAILURE,      // LOW – diagnostic only
    FIBRE_OPTIC,             // MEDIUM – network impact

    // ============================
    // OTHER
    // ============================
    UNKNOWN                 // MEDIUM – fallback case
}
