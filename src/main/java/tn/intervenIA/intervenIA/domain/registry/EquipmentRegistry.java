package tn.intervenIA.intervenIA.domain.registry;

import org.springframework.stereotype.Component;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentName;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentRequirement;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentType;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentUsageType;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

/*
 * Central registry that maps every concrete equipment (from speciality enums)
 * to the generic EquipmentType category.
 *
 * This prevents hard-coding logic inside entities or services.
 */
import java.util.*;

import static tn.intervenIA.intervenIA.domain.model.equipment.EquipmentUsageType.PER_MISSION;
import static tn.intervenIA.intervenIA.domain.model.equipment.EquipmentUsageType.PER_TECHNICIAN;


@Component
public class EquipmentRegistry {

    private static final Map<Enum<?>, EquipmentType> typeMap = new HashMap<>();
    private static final Map<ProfessionalSpeciality, List<EquipmentRequirement>> RULES =
            new EnumMap<>(ProfessionalSpeciality.class);

    static {


        typeMap.put(EquipmentName.LUX_METER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.LADDER, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.HARNESS, EquipmentType.SAFETY_EQUIPMENT);
        typeMap.put(EquipmentName.POLE_CLIMBING_SPIKES, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.UNDERGROUND_CABLE_TRACER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.CABLE_FAULT_LOCATOR, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.VOLTAGE_DETECTOR, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.MULTIMETER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.HYDRAULIC_LIFT_TRUCK, EquipmentType.INTERVENTION_VEHICLES);
        typeMap.put(EquipmentName.LED_DRIVERS, EquipmentType.SPARE_PARTS);
        typeMap.put(EquipmentName.PHOTOCELLS, EquipmentType.SPARE_PARTS);
        typeMap.put(EquipmentName.BALLASTS, EquipmentType.SPARE_PARTS);
        typeMap.put(EquipmentName.SPARE_LAMPS, EquipmentType.SPARE_PARTS);



        typeMap.put(EquipmentName.INSULATED_GLOVES, EquipmentType.SAFETY_EQUIPMENT);
        typeMap.put(EquipmentName.INSULATED_TOOLS, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.THERMAL_CAMERA, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.EARTH_RESISTANCE_TESTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PHASE_ROTATION_TESTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PORTABLE_GENERATOR, EquipmentType.INTERVENTION_VEHICLES);
        typeMap.put(EquipmentName.HYDRAULIC_CRIMPER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.CABLE_STRIPPER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.SURGE_PROTECTOR_TESTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.BATTERY_DIAGNOSTIC_KIT, EquipmentType.TECHNICAL_TOOLS);



        typeMap.put(EquipmentName.LOOP_DETECTOR_TESTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.TRAFFIC_CONTROLLER_DIAGNOSTIC_TOOL, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PORTABLE_TRAFFIC_LIGHTS, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.SIGNAL_HEAD_LIFTING_POLE, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.UPS_BATTERY_TESTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.OSCILLOSCOPE, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.CONTROLLER_SPARE_MODULES, EquipmentType.SPARE_PARTS);
        typeMap.put(EquipmentName.ELECTRICAL_TOOLKIT, EquipmentType.TECHNICAL_TOOLS);


        typeMap.put(EquipmentName.SMOKE_DETECTOR_TESTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.FIRE_EXTINGUISHER_PRESSURE_GAUGE, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.FIRE_PUMP_PRESSURE_TEST_KIT, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.HYDRANT_FLOW_METER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.GAS_LEAK_DETECTOR, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.HOSE_INSPECTION_TOOL, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PROTECTIVE_GEAR, EquipmentType.SAFETY_EQUIPMENT);

        typeMap.put(EquipmentName.FIBER_FUSION_SPLICER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.OTDR, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.LAN_CABLE_TESTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.WIFI_ANALYZER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.SOLDERING_STATION, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.GPS_DEVICE, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.IOT_GATEWAY_CONFIGURATOR, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.SIM_CARD_TESTER, EquipmentType.TECHNICAL_TOOLS);


        typeMap.put(EquipmentName.GAS_LEAK_SNIFFER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.MANOMETER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PRESSURE_REGULATOR_TOOL, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PIPE_FREEZING_KIT, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.NON_SPARKING_TOOLS, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PIPE_WELDING_MACHINE, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.HEAT_FUSION_MACHINE, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.GAS_DETECTION_METER, EquipmentType.TECHNICAL_TOOLS);

        typeMap.put(EquipmentName.DRAIN_INSPECTION_CAMERA, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.HIGH_PRESSURE_JET, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.MANHOLE_LIFTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.SLUDGE_PUMP, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.FLOW_METER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.RODDER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PROTECTIVE_BOOT_AND_GEAR, EquipmentType.SAFETY_EQUIPMENT);


        typeMap.put(EquipmentName.ASPHALT_CUTTER, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.COMPACTOR_PLATE, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.CRACK_SEALING_MACHINE, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.MEASURING_WHEEL, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.TRAFFIC_CONES, EquipmentType.CONSUMABLE_MATERIALS);
        typeMap.put(EquipmentName.ROAD_BARRIERS, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.PAINT_MARKING_MACHINE, EquipmentType.HEAVY_TECHNICAL_EQUIPMENT);
        typeMap.put(EquipmentName.SURVEYING_LEVEL, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.THEODOLITE, EquipmentType.TECHNICAL_TOOLS);

        typeMap.put(EquipmentName.BRUSH_CUTTER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.LEAF_BLOWER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.TREE_PRUNING_TOOL, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PRESSURE_SPRAYER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.WASTE_CONTAINER_RFID_READER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.NOISE_LEVEL_METER, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.SOIL_MOISTURE_SENSOR, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.PROTECTIVE_GLOVES, EquipmentType.SAFETY_EQUIPMENT);

        typeMap.put(EquipmentName.FIRST_AID_KIT, EquipmentType.SAFETY_EQUIPMENT);
        typeMap.put(EquipmentName.PORTABLE_LIGHTING, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.COMMUNICATION_RADIO, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.INCIDENT_TABLET, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.POWER_BANK, EquipmentType.TECHNICAL_TOOLS);
        typeMap.put(EquipmentName.CAUTION_TAPE, EquipmentType.CONSUMABLE_MATERIALS);
        typeMap.put(EquipmentName.BASIC_TOOLKIT, EquipmentType.TECHNICAL_TOOLS);



        //Equipment rules


        // =========================
        // ELECTRICITY
        // =========================
        RULES.put(ProfessionalSpeciality.ELECTRICITY, List.of(
                req(EquipmentName.INSULATED_GLOVES, 1, PER_TECHNICIAN),
                req(EquipmentName.INSULATED_TOOLS, 1, PER_TECHNICIAN),
                req(EquipmentName.MULTIMETER, 1, PER_TECHNICIAN),
                req(EquipmentName.VOLTAGE_DETECTOR, 1, PER_TECHNICIAN),

                req(EquipmentName.PORTABLE_GENERATOR, 1, PER_MISSION),
                req(EquipmentName.HYDRAULIC_LIFT_TRUCK, 1, PER_MISSION),
                req(EquipmentName.ELECTRICAL_TOOLKIT, 1, PER_MISSION),
                req(EquipmentName.THERMAL_CAMERA, 1, PER_MISSION)
        ));

        // =========================
        // GAS
        // =========================
        RULES.put(ProfessionalSpeciality.GAZ, List.of(
                req(EquipmentName.PROTECTIVE_GEAR, 1, PER_TECHNICIAN),
                req(EquipmentName.GAS_LEAK_DETECTOR, 1, PER_TECHNICIAN),
                req(EquipmentName.NON_SPARKING_TOOLS, 1, PER_TECHNICIAN),

                req(EquipmentName.PIPE_WELDING_MACHINE, 1, PER_MISSION),
                req(EquipmentName.GAS_DETECTION_METER, 1, PER_MISSION),
                req(EquipmentName.MANOMETER, 1, PER_MISSION)
        ));

        // =========================
        // FIRE & SAFETY
        // =========================
        RULES.put(ProfessionalSpeciality.FIRE_SAFETY, List.of(
                req(EquipmentName.PROTECTIVE_GEAR, 1, PER_TECHNICIAN),
                req(EquipmentName.FIRST_AID_KIT, 1, PER_TECHNICIAN),

                req(EquipmentName.THERMAL_CAMERA, 1, PER_MISSION),
                req(EquipmentName.HYDRANT_FLOW_METER, 1, PER_MISSION),
                req(EquipmentName.FIRE_PUMP_PRESSURE_TEST_KIT, 1, PER_MISSION)
        ));

        // =========================
        // PUBLIC LIGHTING
        // =========================
        RULES.put(ProfessionalSpeciality.PUBLIC_LIGHTING, List.of(
                req(EquipmentName.PROTECTIVE_GLOVES, 1, PER_TECHNICIAN),
                req(EquipmentName.LUX_METER, 1, PER_TECHNICIAN),

                req(EquipmentName.LADDER, 1, PER_MISSION),
                req(EquipmentName.LED_DRIVERS, 2, PER_MISSION),
                req(EquipmentName.SPARE_LAMPS, 5, PER_MISSION)
        ));

        // =========================
        // ROADS
        // =========================
        RULES.put(ProfessionalSpeciality.ROADS, List.of(
                req(EquipmentName.PROTECTIVE_GLOVES, 1, PER_TECHNICIAN),

                req(EquipmentName.ASPHALT_CUTTER, 1, PER_MISSION),
                req(EquipmentName.COMPACTOR_PLATE, 1, PER_MISSION),
                req(EquipmentName.TRAFFIC_CONES, 10, PER_MISSION),
                req(EquipmentName.ROAD_BARRIERS, 4, PER_MISSION)
        ));

        // =========================
        // WATER & SANITATION
        // =========================
        RULES.put(ProfessionalSpeciality.SANITATION, List.of(
                req(EquipmentName.PROTECTIVE_BOOT_AND_GEAR, 1, PER_TECHNICIAN),

                req(EquipmentName.DRAIN_INSPECTION_CAMERA, 1, PER_MISSION),
                req(EquipmentName.HIGH_PRESSURE_JET, 1, PER_MISSION),
                req(EquipmentName.SLUDGE_PUMP, 1, PER_MISSION),
                req(EquipmentName.MANHOLE_LIFTER, 1, PER_MISSION)
        ));

        // =========================
        // TELECOM / IOT
        // =========================
        RULES.put(ProfessionalSpeciality.TELECOMMUNICATION_IOT, List.of(
                req(EquipmentName.INCIDENT_TABLET, 1, PER_TECHNICIAN),
                req(EquipmentName.COMMUNICATION_RADIO, 1, PER_TECHNICIAN),

                req(EquipmentName.OTDR, 1, PER_MISSION),
                req(EquipmentName.FIBER_FUSION_SPLICER, 1, PER_MISSION),
                req(EquipmentName.IOT_GATEWAY_CONFIGURATOR, 1, PER_MISSION)
        ));

        // =========================
        // EMERGENCY (fallback / cross-speciality)
        // =========================
        RULES.put(ProfessionalSpeciality.EMERGENCY, List.of(
                req(EquipmentName.FIRST_AID_KIT, 1, PER_TECHNICIAN),
                req(EquipmentName.COMMUNICATION_RADIO, 1, PER_TECHNICIAN),

                req(EquipmentName.PORTABLE_LIGHTING, 2, PER_MISSION),
                req(EquipmentName.POWER_BANK, 2, PER_MISSION)
        ));

    }

    /**
     * Returns the generic EquipmentType for a concrete equipment name.
     */
    public static EquipmentType getType(Enum<?> equipmentName) {
        return typeMap.getOrDefault(equipmentName, null);
    }

    /**
     * Returns all equipment names belonging to a given EquipmentType.
     */
    public static List<Enum<?>> getEquipmentsByType(EquipmentType type) {
        List<Enum<?>> result = new ArrayList<>();

        for (Map.Entry<Enum<?>, EquipmentType> entry : typeMap.entrySet()) {
            if (entry.getValue() == type) {
                result.add(entry.getKey());
            }
        }

        return result;
    }

    public List<EquipmentRequirement> getRequirements(ProfessionalSpeciality speciality) {
        return RULES.getOrDefault(speciality, List.of());
    }

    private static EquipmentRequirement req(
            EquipmentName name,
            int quantity,
            EquipmentUsageType type
    ) {
        EquipmentRequirement r = new EquipmentRequirement();
        r.setName(name);
        r.setQuantity(quantity);
        r.setUsageType(type);
        return r;
    }

}
