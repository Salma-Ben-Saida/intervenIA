package tn.intervent360.intervent360.application.service.user;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.repository.UserRepository;
import tn.intervent360.intervent360.web.dto.UserDTO;
import tn.intervent360.intervent360.application.mapper.UserMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ============================
    //            CREATE
    // ============================

    public UserDTO createUser(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = UserMapper.toUser(dto);

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // By default: technicians are available
        if (dto.getRole() == Role.TECHNICIAN) {
            user.setIsAvailable(true);
        }

        User saved = userRepository.save(user);
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
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(id);
    }
}

