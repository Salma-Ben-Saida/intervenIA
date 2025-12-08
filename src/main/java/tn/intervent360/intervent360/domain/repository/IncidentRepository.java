package tn.intervent360.intervent360.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.incident.Location;
import tn.intervent360.intervent360.domain.model.incident.Incident;
import tn.intervent360.intervent360.domain.model.incident.IncidentStatus;
import tn.intervent360.intervent360.domain.model.incident.IncidentType;
import tn.intervent360.intervent360.domain.model.incident.UrgencyLevel;

import java.util.List;

@Repository
public interface IncidentRepository extends MongoRepository<Incident, String> {

    List<Incident> findByCitizenId(String citizenId);

    List<Incident> findByIncidentStatus(IncidentStatus status);

    List<Incident> findByIncidentStatusIn(List<IncidentStatus> incidentStatuses);
    List<Incident> findByIncidentType(IncidentType status);
    List<Incident> findByUrgencyLevel(UrgencyLevel urgencyLevel);
    List<Incident> findByZone(Zone zone);
}

