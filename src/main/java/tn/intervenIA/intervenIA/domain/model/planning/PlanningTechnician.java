//Contains availability and working constraints.

package tn.intervenIA.intervenIA.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.domain.model.Zone;

@Getter @Setter
public class PlanningTechnician {

    private String technicianId;
    private String teamId;

    private ProfessionalSpeciality speciality;
    private Zone zone;

    private int maxDailyHours;
    private int currentAssignedHours;
    private int weeklyHoursAssigned = 0;


    private int shiftStart;
    private int shiftEnd;

    private boolean available;
    private boolean onCall;
}
