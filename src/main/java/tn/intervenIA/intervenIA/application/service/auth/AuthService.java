package tn.intervenIA.intervenIA.application.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.intervenIA.intervenIA.domain.model.user.User;
import tn.intervenIA.intervenIA.domain.repository.UserRepository;
import tn.intervenIA.intervenIA.infrastructure.security.JwtService;
import tn.intervenIA.intervenIA.web.dto.Auth.AuthRequest;
import tn.intervenIA.intervenIA.web.dto.Auth.AuthResponse;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;


    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        // Use the same PasswordEncoder that was used to encode the password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getUsername(),
                user.getManagedZone() != null ? user.getManagedZone().name() : null,
                user.getSpeciality() != null ? user.getSpeciality().name() : null
        );
    }
}

