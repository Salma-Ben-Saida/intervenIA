package tn.intervent360.intervent360.web.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.web.dto.UserDTO;
import tn.intervent360.intervent360.application.service.user.UserService;
import tn.intervent360.intervent360.application.mapper.TeamMapper;
import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.web.dto.ScopeDTO;
import tn.intervent360.intervent360.web.dto.TeamDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final tn.intervent360.intervent360.domain.repository.TeamRepository teamRepository;

    // ============================
    //            CREATE
    // ============================

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    // ============================
    //            READ
    // ============================

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/team/{id}")
    public ResponseEntity<List<UserDTO>> getByTeamId(@PathVariable String id) {
        return ResponseEntity.ok(userService.findByTeamID(id));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> getByRole(@PathVariable Role role) {
        return ResponseEntity.ok(userService.findByRole(role));
    }


    @GetMapping("/speciality/{speciality}")
    public ResponseEntity<List<UserDTO>> getBySpeciality(@PathVariable ProfessionalSpeciality speciality) {
        return ResponseEntity.ok(userService.findBySpeciality(speciality));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Optional<UserDTO>> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    // ============================
    //            UPDATE
    // ============================

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable String id, @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    // ============================
    //            DELETE
    // ============================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{onCall}/{id}")
    public ResponseEntity<Optional<UserDTO>> changeOnCallStatus(@PathVariable String id, @PathVariable Boolean onCall) {
        userService.changeOnCallStatus(id, onCall);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{shiftStart}/{shiftEnd}/{id}")
    public ResponseEntity<Optional<UserDTO>> changeShifts(@PathVariable String id, @PathVariable int shiftStart, @PathVariable int shiftEnd) {
        userService.changeShifts(id, shiftStart, shiftEnd);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/email/contains/{substring}")
    public List<UserDTO> findByEmailContaining(@PathVariable String substring) {
        return userService.findByEmailContaining(substring);
    }

    // ============================
    //     MANAGER SCOPE ENDPOINTS
    // ============================
    @GetMapping("/{managerId}/managed-teams")
    public ResponseEntity<List<TeamDTO>> getManagedTeams(@PathVariable String managerId) {
        User manager = userService.getDomainUserById(managerId);
        if (manager.getRole() != Role.MANAGER) {
            return ResponseEntity.badRequest().build();
        }
        var teams = teamRepository.findBySpecialityAndZone(manager.getManagedSpeciality(), manager.getManagedZone())
                .stream().map(TeamMapper::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{managerId}/scope")
    public ResponseEntity<ScopeDTO> getManagerScope(@PathVariable String managerId) {
        User manager = userService.getDomainUserById(managerId);
        if (manager.getRole() != Role.MANAGER) {
            return ResponseEntity.badRequest().build();
        }
        ScopeDTO dto = new ScopeDTO();
        dto.setManagedZone(manager.getManagedZone());
        dto.setManagedSpeciality(manager.getManagedSpeciality());
        return ResponseEntity.ok(dto);
    }

}

