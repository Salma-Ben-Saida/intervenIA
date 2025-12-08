//Contains availability and working constraints.

package tn.intervent360.intervent360.domain.model.planning;

import lombok.Getter;
import lombok.Setter;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.Zone;

@Getter @Setter
public class PlanningTechnician {

    private String technicianId;
    private String teamId;

    private ProfessionalSpeciality speciality;
    private Zone zone;

    private int maxDailyHours;
    private int currentAssignedHours;
    private int weeklyHoursAssigned = 0;


    private long shiftStart; // e.g. 08:00
    private long shiftEnd;   // e.g. 18:00

    private boolean available;
}
