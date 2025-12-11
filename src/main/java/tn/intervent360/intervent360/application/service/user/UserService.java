package tn.intervent360.intervent360.application.service.user;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Team;
import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.repository.TeamRepository;
import tn.intervent360.intervent360.domain.repository.UserRepository;
import tn.intervent360.intervent360.web.dto.UserDTO;
import tn.intervent360.intervent360.application.mapper.UserMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    // ============================
    //            CREATE
    // ============================

    public UserDTO createUser(UserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Convert DTO → User (only simple fields + teamId)
        User user = UserMapper.toUser(dto);

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setDefaultShifts();

        if (user.getRole() != Role.CITIZEN) {
            user.setMaxDailyHours(8);
        }

        // Save once to generate ID (required BEFORE putting him inside team)
        User saved = userRepository.save(user);

        // ===============================================
        //        CASE 1 — Technician creation
        // ===============================================
        if (saved.getRole() == Role.TECHNICIAN) {

            if (dto.getTeamId() == null) {
                throw new IllegalArgumentException("Technician must have a teamId");
            }

            Team team = teamRepository.findById(dto.getTeamId())
                    .orElseThrow(() -> new IllegalArgumentException("Team not found: " + dto.getTeamId()));

            // Add technician to team
            team.addTechnician(saved.getId());
            Team updatedTeam = teamRepository.save(team);

            // Embed team object in technician
            saved.setTeam(updatedTeam);
            saved.setIsAvailable(true);
            saved = userRepository.save(saved);

            // Update leader embedded team
            if (updatedTeam.getLeaderId() != null) {
                userRepository.findById(updatedTeam.getLeaderId()).ifPresent(leader -> {
                    leader.setTeam(updatedTeam);
                    userRepository.save(leader);
                });
            }

            return UserMapper.toUserDTO(saved);
        }

        // ===============================================
        //        CASE 2 — Leader creation
        // ===============================================
        if (saved.getRole() == Role.LEADER && dto.getTeamId() != null) {

            Team team = teamRepository.findById(dto.getTeamId())
                    .orElseThrow(() -> new IllegalArgumentException("Team not found: " + dto.getTeamId()));

            // Assign leader
            team.setLeaderId(saved.getId());
            Team updatedTeam = teamRepository.save(team);

            // Embed in leader
            saved.setTeam(updatedTeam);
            saved = userRepository.save(saved);

            // Update embedded team in all technicians of this team
            for (String techId : updatedTeam.getTechnicianIds()) {
                userRepository.findById(techId).ifPresent(tech -> {
                    tech.setTeam(updatedTeam);
                    userRepository.save(tech);
                });
            }

            return UserMapper.toUserDTO(saved);
        }

        // Citizen or leader with no team
        return UserMapper.toUserDTO(saved);
    }



    // ============================
    //            READ
    // ============================

    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return UserMapper.toUserDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toUserDTO)
                .toList();
    }

    public Optional<UserDTO> findByEmail(String email) {
        Optional<User> returnedUser= userRepository.findByEmail(email);
        return returnedUser.map(UserMapper::toUserDTO);
    }

    public List<UserDTO> findByTeamID(String id) {
        return userRepository.findByTeamId(id)
                .stream()
                .map(UserMapper::toUserDTO)
                .toList();
    }

    public List<UserDTO> findBySpeciality(ProfessionalSpeciality speciality) {
        return userRepository.findBySpeciality(speciality)
                .stream()
                .map(UserMapper::toUserDTO)
                .toList();
    }

    public List<UserDTO> findByRole(Role role) {
        return userRepository.findByRole(role)
                .stream()
                .map(UserMapper::toUserDTO)
                .toList();
    }

    // ============================
    //            UPDATE
    // ============================

    public UserDTO updateUser(String id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());

        // Update password only if provided
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updated = userRepository.save(user);
        return UserMapper.toUserDTO(updated);
    }

    // ============================
    //            DELETE
    // ============================

    public void deleteUser(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // CASE 1 — If user is a technician: remove from team
        if (user.getRole() == Role.TECHNICIAN) {

            if (user.getTeam() != null) {
                String teamId = user.getTeam().getId();

                teamRepository.findById(teamId).ifPresent(team -> {
                    team.removeTechnician(id);
                    teamRepository.save(team);
                });
            }
        }

        // CASE 2 — If user is a leader: clear leaderId
        if (user.getRole() == Role.LEADER) {

            teamRepository.findByLeaderId(id).ifPresent(team -> {
                team.setLeaderId(null);
                teamRepository.save(team);
            });
        }

        userRepository.deleteById(id);
    }
}

