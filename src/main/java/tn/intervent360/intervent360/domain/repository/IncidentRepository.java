package tn.intervent360.intervent360.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.incident.Incident;
import tn.intervent360.intervent360.domain.model.incident.IncidentStatus;
import tn.intervent360.intervent360.domain.model.incident.IncidentType;

import java.util.List;

@Repository
public interface IncidentRepository extends MongoRepository<Incident, String> {

    List<Incident> findByCitizenId(String citizenId);

    List<Incident> findByIncidentStatus(IncidentStatus status);
    List<Incident> findByIncidentType(IncidentType status);
}

