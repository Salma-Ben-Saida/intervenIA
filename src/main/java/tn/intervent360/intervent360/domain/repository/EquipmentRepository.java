package tn.intervent360.intervent360.domain.repository;


import org.apache.catalina.Wrapper;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.equipment.Equipment;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentName;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentStatus;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentType;

import java.util.List;
import java.util.Optional;

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
    );}

