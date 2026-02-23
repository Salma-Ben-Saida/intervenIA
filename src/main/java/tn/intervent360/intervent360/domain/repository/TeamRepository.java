package tn.intervent360.intervent360.domain.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {


    Optional<Team> findByTechnicianIdsContains(String technicianId);
    Optional<Team> findByLeaderId(String leaderId);

    List<Team> getBySpeciality(ProfessionalSpeciality speciality);

    List<Team> findBySpecialityAndZone(ProfessionalSpeciality speciality, Zone zone);
}

