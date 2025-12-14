package tn.intervent360.intervent360.application.service.team;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.domain.model.team.Team;
import tn.intervent360.intervent360.domain.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class TeamEmbeddingService {

    private final UserRepository userRepository;

    public void refreshEmbeddedTeam(Team team) {

        // Update technicians
        for (String techId : team.getTechnicianIds()) {
            userRepository.findById(techId).ifPresent(tech -> {
                tech.setTeam(team);
                userRepository.save(tech);
            });
        }

        // Update leader
        if (team.getLeaderId() != null) {
            userRepository.findById(team.getLeaderId()).ifPresent(leader -> {
                leader.setTeam(team);
                userRepository.save(leader);
            });
        }
    }

    public void clearEmbeddedTeam(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setTeam(null);
            userRepository.save(user);
        });
    }
}
