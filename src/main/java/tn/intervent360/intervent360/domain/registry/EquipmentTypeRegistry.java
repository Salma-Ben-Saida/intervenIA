package tn.intervent360.intervent360.domain.registry;

import tn.intervent360.intervent360.domain.model.equipment.EquipmentName;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentType;
import tn.intervent360.intervent360.domain.model.equipment.equipments_per_speciality.*;

/**
 * Central registry that maps every concrete equipment (from speciality enums)
 * to the generic EquipmentType category.
 *
 * This prevents hard-coding logic inside entities or services.
 */
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EquipmentTypeRegistry {

    private static final Map<Enum<?>, EquipmentType> typeMap = new HashMap<>();

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

}
