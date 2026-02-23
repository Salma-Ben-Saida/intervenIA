package tn.intervent360.intervent360.web.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.user.Role;

@Data
public class UserDTO {
    private String id;
    private String email;
    private String username;
    private String password;
    private Role role;
    private Boolean isAvailable;
    private ProfessionalSpeciality speciality;
    private String teamId;
    private int shiftStart;
    private int shiftEnd;
    private int maxDailyHours;
    private Boolean onCall;

    // Manager scope (nullable for non-managers)
    private tn.intervent360.intervent360.domain.model.Zone managedZone;
    private ProfessionalSpeciality managedSpeciality;
}
