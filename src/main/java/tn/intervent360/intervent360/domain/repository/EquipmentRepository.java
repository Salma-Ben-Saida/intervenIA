package tn.intervent360.intervent360.domain.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.Location;
import tn.intervent360.intervent360.domain.model.equipment.Equipment;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentName;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentStatus;
import tn.intervent360.intervent360.domain.model.equipment.EquipmentType;

import java.util.List;

@Repository
public interface EquipmentRepository extends MongoRepository<Equipment, String> {


    List<Equipment> findByEquipmentType(EquipmentType type);

    List<Equipment> findByQuantityGreaterThan(int amount);

    List<Equipment> findByQuantityEquals(int amount);

    List<Equipment> findByStatus(EquipmentStatus status);
}

