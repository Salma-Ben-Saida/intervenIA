package tn.intervent360.intervent360.domain.registry;

import tn.intervent360.intervent360.domain.model.equipment.equipments_per_speciality.*;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;

import java.util.HashMap;
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
        equipmentMap.put(ProfessionalSpeciality.TELECOMMUNICATION_IOT ,TelecomIotEquipment.class);
        equipmentMap.put(ProfessionalSpeciality.EMERGENCY, EmergencyEquipment.class);
    }

    public static Class<? extends Enum<?>> getEquipmentEnum(ProfessionalSpeciality speciality) {
        return equipmentMap.get(speciality);
    }
}

