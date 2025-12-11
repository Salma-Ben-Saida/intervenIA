package tn.intervent360.intervent360.web.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Team;
import tn.intervent360.intervent360.domain.model.user.Role;

import java.util.Date;

@Data
public class UserDTO {
    private String id;
    private String email;
    private String username;
    private String password;
    private Role role;
    private Boolean isAvailable;
    private ProfessionalSpeciality speciality;
    private Team team;
    private String teamId;
    private Date shiftStart;
    private Date shiftEnd;
    private int maxDailyHours;

}
