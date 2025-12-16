package tn.intervent360.intervent360.application.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.domain.repository.UserRepository;
import tn.intervent360.intervent360.infrastructure.security.JwtService;
import tn.intervent360.intervent360.web.dto.Auth.AuthRequest;
import tn.intervent360.intervent360.web.dto.Auth.AuthResponse;

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
                user.getId()
        );
    }
}

