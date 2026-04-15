package tn.intervenIA.intervenIA.web.dto.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

@Getter @Setter
public class TechnicianDTO {

    private String id;
    private String name;
    private ProfessionalSpeciality speciality;
    private String teamId;

    private long shiftStart;
    private long shiftEnd;
    private int maxDailyHours;

    private boolean available;
}
