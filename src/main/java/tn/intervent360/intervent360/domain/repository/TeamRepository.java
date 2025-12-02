package tn.intervent360.intervent360.domain.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.team.Team;

import java.util.Optional;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {

    boolean existsByName(String name);

    Optional<Team> findByTechnicianIdsContains(String technicianId);
    Optional<Team> findByLeaderId(String leaderId);
}

