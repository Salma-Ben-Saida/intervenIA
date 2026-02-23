package tn.intervent360.intervent360.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.model.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);
    List<User> findByTeamId(String id);

    List<User> findBySpeciality(tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality speciality);

    boolean existsByEmail(String email);

    List<User> findByTeamIdInAndIsAvailableAndRole(List<String> teamIds, boolean isAvailable, Role role);

    List<User> findByEmailContainingIgnoreCase(String substring);

    Optional<User> findByRoleAndManagedZoneAndManagedSpeciality(
            Role role,
            tn.intervent360.intervent360.domain.model.Zone managedZone,
            tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality managedSpeciality
    );
}
