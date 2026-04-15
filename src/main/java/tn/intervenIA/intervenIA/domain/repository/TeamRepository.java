package tn.intervenIA.intervenIA.domain.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.team.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {


    Optional<Team> findByTechnicianIdsContains(String technicianId);
    Optional<Team> findByLeaderId(String leaderId);

    List<Team> getBySpeciality(ProfessionalSpeciality speciality);

    List<Team> findBySpecialityAndZone(ProfessionalSpeciality speciality, Zone zone);

    // Batch fetch teams by zone and a list of specialities
    List<Team> findByZoneAndSpecialityIn(Zone zone, List<ProfessionalSpeciality> specialities);
}

