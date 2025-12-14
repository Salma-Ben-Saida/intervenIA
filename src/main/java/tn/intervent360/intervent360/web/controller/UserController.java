package tn.intervent360.intervent360.web.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.web.dto.UserDTO;
import tn.intervent360.intervent360.application.service.user.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

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


}

