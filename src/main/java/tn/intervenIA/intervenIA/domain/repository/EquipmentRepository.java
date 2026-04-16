package tn.intervenIA.intervenIA.domain.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.equipment.Equipment;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentName;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentStatus;
import tn.intervenIA.intervenIA.domain.model.equipment.EquipmentType;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.List;

@Repository
public interface EquipmentRepository extends MongoRepository<Equipment, String> {


    List<Equipment> findByEquipmentType(EquipmentType type);

    List<Equipment> findByQuantityGreaterThan(int amount);

    List<Equipment> findByQuantityEquals(int amount);

    List<Equipment> findByStatus(EquipmentStatus status);

    List<Equipment> findByZone(Zone zone);

    List<Equipment> findByEquipmentNameAndZone(
            EquipmentName name,
            Zone zone
    );

}

