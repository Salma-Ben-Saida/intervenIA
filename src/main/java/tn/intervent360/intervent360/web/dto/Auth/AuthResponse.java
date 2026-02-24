package tn.intervent360.intervent360.web.dto.Auth;

public record AuthResponse(
        String token,
        String role,
        String userId,
        String username,
        String zone,
        String speciality
) {}