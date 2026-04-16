package tn.intervenIA.intervenIA.application.service.user;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.team.Team;
import tn.intervenIA.intervenIA.domain.model.user.User;
import tn.intervenIA.intervenIA.domain.model.user.Role;
import tn.intervenIA.intervenIA.domain.repository.TeamRepository;
import tn.intervenIA.intervenIA.domain.repository.UserRepository;
import tn.intervenIA.intervenIA.domain.repository.planning.PlanningAssignmentRepository;
import tn.intervenIA.intervenIA.web.dto.UserDTO;
import tn.intervenIA.intervenIA.application.mapper.UserMapper;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;

    private final PlanningAssignmentRepository assignmentRepository;

    // ============================
    //            CREATE
    // ============================

    public UserDTO createUser(UserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }


        User user = UserMapper.toUser(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // Enforce manager scope rules
        if (user.getRole() == Role.MANAGER) {
            if (dto.getManagedZone() == null) {
                throw new IllegalArgumentException("Manager must have a managed zone and speciality");
            }
            // mapper already set these from dto
        } else {
            user.setManagedZone(null);
        }

        if (user.getRole() == Role.TECHNICIAN) {
            user.setIsAvailable(true);
        } else {
            user.setIsAvailable(null);
        }

        if (user.getRole() != Role.CITIZEN) {
            user.setMaxDailyHours(8);
        }

        User saved = userRepository.save(user);

        if (saved.getRole() == Role.TECHNICIAN || saved.getRole() == Role.LEADER) {

            if (dto.getTeamId() == null)
                throw new IllegalArgumentException("User must belong to a team");

            Team team = teamRepository.findById(dto.getTeamId())
                    .orElseThrow(() -> new IllegalArgumentException("Team not found"));

            if (saved.getRole() == Role.TECHNICIAN) {
                team.addTechnician(saved.getId());
            } else if (saved.getRole() == Role.LEADER) {
                team.setLeaderId(saved.getId());
            }

            teamRepository.save(team);

            if (saved.getRole() == Role.TECHNICIAN) {
                saved.setIsAvailable(true);
                saved = userRepository.save(saved);
            }

        }

        return UserMapper.toUserDTO(saved);
    }



    // ============================
    //            READ
    // ============================

    public UserDTO getUserById(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserDTO dto = UserMapper.toUserDTO(user);
        computeLiveAvailability(user, dto);

        return dto;
    }


    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> {
                    UserDTO dto = UserMapper.toUserDTO(user);
                    computeLiveAvailability(user, dto);
                    return dto;
                })
                .toList();
    }

    // Internal helper for controllers that need domain entity
    public User getDomainUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }


    public Optional<UserDTO> findByEmail(String email) {
        Optional<User> returnedUser= userRepository.findByEmail(email);
        return returnedUser.map(UserMapper::toUserDTO);
    }

    public List<UserDTO> findByTeamID(String id) {

        return userRepository.findByTeamId(id)
                .stream()
                .map(user -> {
                    UserDTO dto = UserMapper.toUserDTO(user);
                    computeLiveAvailability(user, dto);
                    return dto;
                })
                .toList();
    }


    public List<UserDTO> findBySpeciality(ProfessionalSpeciality speciality) {

        return userRepository.findBySpeciality(speciality)
                .stream()
                .map(user -> {
                    UserDTO dto = UserMapper.toUserDTO(user);
                    computeLiveAvailability(user, dto);
                    return dto;
                })
                .toList();
    }


    public List<UserDTO> findByRole(Role role) {

        return userRepository.findByRole(role)
                .stream()
                .map(user -> {
                    UserDTO dto = UserMapper.toUserDTO(user);
                    computeLiveAvailability(user, dto);
                    return dto;
                })
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

        // Enforce manager scope rules on update
        if (dto.getRole() == Role.MANAGER) {
            if (dto.getManagedZone() == null) {
                throw new IllegalArgumentException("Manager must have a managed zone and speciality");
            }
            user.setManagedZone(dto.getManagedZone());
        } else {
            user.setManagedZone(null);
        }

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

            if (user.getTeamId() != null) {
                String teamId = user.getTeamId();

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

    public void changeOnCallStatus(String id, Boolean callStatus) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setOnCall(callStatus);
        userRepository.save(user);
    }

    public void changeShifts(String id, int ShiftStart, int ShiftEnd) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setShiftStart(ShiftStart);
        user.setShiftEnd(ShiftEnd);
        userRepository.save(user);
    }

    private void computeLiveAvailability(User user, UserDTO dto) {

        if (user.getRole() != Role.TECHNICIAN) {
            dto.setIsAvailable(null);
            return;
        }

        boolean busy =
                assignmentRepository.existsByTechnicianIdAndStartTimeLessThanEqualAndEndTimeAfter(
                        user.getId(),
                        Instant.now(),
                        Instant.now()
                );

        dto.setIsAvailable(!busy);
    }

    public List<UserDTO> findByEmailContaining(String substring) {
        return userRepository.findByEmailContainingIgnoreCase(substring)
                .stream()
                .map(UserMapper::toUserDTO)
                .collect(Collectors.toList());
    }


}

