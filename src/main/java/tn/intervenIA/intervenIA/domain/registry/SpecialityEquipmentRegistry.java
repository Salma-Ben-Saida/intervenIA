package tn.intervenIA.intervenIA.domain.registry;

import tn.intervenIA.intervenIA.domain.model.equipment.equipments_per_speciality.*;

import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SpecialityEquipmentRegistry {

    private static final Map<ProfessionalSpeciality, Class<? extends Enum<?>>> equipmentMap = new HashMap<>();

    static {
        equipmentMap.put(ProfessionalSpeciality.PUBLIC_LIGHTING, PublicLightingEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.ELECTRICITY, ElectricityEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.TRAFFIC_SIGNALS, TrafficSignalEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.GAZ, GasEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.SANITATION, SanitationEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.ROADS, RoadEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.ENVIRONMENT, EnvironmentEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.FIRE_SAFETY, FireSafetyEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.TELECOMMUNICATION_IOT , TelecomIotEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.EMERGENCY, EmergencyEquipment.class);
    }

    // Return all equipment names for ONE speciality
    public static List<String> getEquipmentFor(ProfessionalSpeciality speciality) {
        Class<? extends Enum<?>> enumClass = equipmentMap.get(speciality);

        if (enumClass == null)
            return List.of();

        return Arrays.stream(enumClass.getEnumConstants()) // returns enum values
                .map(Enum::name)                            // convert to String
                .toList();
    }

    // Merge & flatten equipment from ALL specialities
    public static List<String> getEquipmentForAll(List<ProfessionalSpeciality> specialities) {
        return specialities.stream()
                .flatMap(s -> getEquipmentFor(s).stream())
                .distinct()
                .toList();
    }
}

