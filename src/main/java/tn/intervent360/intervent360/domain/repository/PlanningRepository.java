package tn.intervent360.intervent360.domain.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.planning.Planning;

import java.util.List;

@Repository
public interface PlanningRepository extends MongoRepository<Planning, String> {

    List<Planning> findByIncidentId(String incidentId);

    List<Planning> findByStatus(String status);
}

