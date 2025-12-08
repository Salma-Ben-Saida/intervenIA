//Choco solver will return a collection of assignments.

package tn.intervent360.intervent360.domain.model.planning;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class PlanningSolution {

    private List<PlanningAssignment> assignments;
    private boolean feasible;
    private String solverMessage;

}
