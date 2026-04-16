package tn.intervenIA.intervenIA.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.user.Role;
import tn.intervenIA.intervenIA.domain.model.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);
    List<User> findByTeamId(String id);

    List<User> findBySpeciality(ProfessionalSpeciality speciality);

    boolean existsByEmail(String email);

    List<User> findByTeamIdInAndIsAvailableAndRole(List<String> teamIds, boolean isAvailable, Role role);

    // Server-side count for availability by teamIds/role
    long countByTeamIdInAndIsAvailableAndRole(List<String> teamIds, boolean isAvailable, Role role);

    // Narrower technician query for planning
    List<User> findByRoleAndIsAvailableTrueAndTeamIdIsNotNull(Role role);

    List<User> findByEmailContainingIgnoreCase(String substring);

}
