package tn.intervenIA.intervenIA.web.dto.Auth;

public record AuthResponse(
        String token,
        String role,
        String userId,
        String username,
        String zone,
        String speciality
) {}