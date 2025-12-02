package tn.intervent360.intervent360.domain.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.model.user.User;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByRole(Role role);
    Optional<User> findBySpeciality(ProfessionalSpeciality speciality);

    boolean existsByEmail(String email);
}
