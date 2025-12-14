package tn.intervent360.intervent360.domain.repository.planning;

import org.springframework.data.mongodb.repository.MongoRepository;
import tn.intervent360.intervent360.domain.model.planning.PlanningAssignment;
import tn.intervent360.intervent360.domain.model.planning.PlanningStatus;

import java.time.Instant;
import java.util.List;

public interface PlanningAssignmentRepository extends MongoRepository<PlanningAssignment, String> {

    List<PlanningAssignment> findByIncidentId(String incidentId);

    List<PlanningAssignment> findByTeamId(String teamId);

    List<PlanningAssignment> findByTechnicianId(String technicianId);

    List<PlanningAssignment> findAllByStatusIs(PlanningStatus status);

    boolean existsByTechnicianIdAndStartTimeLessThanEqualAndEndTimeAfter(
            String technicianId,
            Instant now1,
            Instant now2
    );
}

