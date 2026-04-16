package tn.intervenIA.intervenIA.web.dto;

import lombok.Data;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.user.Role;

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
    private Zone managedZone;
}
