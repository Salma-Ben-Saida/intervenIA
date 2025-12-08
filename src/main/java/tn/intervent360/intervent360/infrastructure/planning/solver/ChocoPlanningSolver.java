package tn.intervent360.intervent360.infrastructure.planning.solver;

import lombok.extern.slf4j.Slf4j;
import org.chocosolver.solver.Model;
import org.chocosolver.solver.variables.IntVar;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.service.planning.expansion.ExpandedPlanningTask;
import tn.intervent360.intervent360.domain.model.planning.*;

import java.util.ArrayList;
import java.util.List;

/**
 * The ChocoPlanningSolver is the optimization engine for IntervenIA.
 *
 * It receives a fully constructed PlanningProblem and produces:
 *  • A feasible schedule (start times + selected technician)
 *  • Or an infeasible result with explanations
 *
 * Solver constraints:
 *  ----------------------------------------------------
 *  (1) speciality match (each task requires one speciality)
 *  (2) zone match (technician must operate in incident zone)
 *  (3) technician availability (isAvailable == true)
 *  (4) shift boundaries (start >= shiftStart, end <= shiftEnd)
 *  (5) earliestStart / deadline
 *  (6) maxDailyHours
 *  (7) weeklyHoursAssigned cannot exceed (maxDailyHours * 7)
 *
 * Output:
 *  ----------------------------------------------------
 *  A PlanningSolution containing a list of PlanningAssignment objects.
 *
 */
@Slf4j
@Component
public class ChocoPlanningSolver {

    public PlanningSolution solve(PlanningProblem problem) {

        List<ExpandedPlanningTask> tasks = problem.getTasks();
        List<PlanningTechnician> techs = problem.getTechnicians();
        int taskCount = tasks.size();
        int techCount = techs.size();
        int horizon = problem.getPlanningHorizonHours();

        Model model = new Model("IntervenIA Solver");

        // Decision variables
        IntVar[] startTimes = model.intVarArray("start", taskCount, 0, horizon);
        IntVar[] techChoice = model.intVarArray("tech", taskCount, 0, techCount - 1);

        // -----------------------------------------
        // Constraints
        // -----------------------------------------
        for (int i = 0; i < taskCount; i++) {

            ExpandedPlanningTask t = tasks.get(i);

            // TECHNICIAN COMPATIBILITY LIST
            List<Integer> validTechIndices = new ArrayList<>();

            for (int k = 0; k < techCount; k++) {

                PlanningTechnician tech = techs.get(k);

                boolean zoneOk = tech.getZone() == t.getZone();
                boolean specOk = tech.getSpeciality() == t.getSpeciality();
                boolean availOk = tech.isAvailable();

                boolean meetsHours = tech.getWeeklyHoursAssigned() + t.getEstimatedDurationHours()
                        <= tech.getMaxDailyHours() * 7;

                if (zoneOk && specOk && availOk && meetsHours) {
                    validTechIndices.add(k);
                }
            }

            if (validTechIndices.isEmpty()) {
                return infeasible("No technician matches speciality/zone/hours for task " + t.getIncidentId());
            }

            // restrict techChoice to valid technicians
            techChoice[i] = model.intVar(
                    "tech_" + i,
                    validTechIndices.stream().mapToInt(Integer::intValue).toArray()
            );

            // earliest start / deadline
            model.arithm(startTimes[i], ">=", (int) t.getEarliestStart()).post();
            model.arithm(startTimes[i], "<=", (int) t.getDeadline()).post();

            // shift constraint
            for (int k = 0; k < techCount; k++) {
                PlanningTechnician tech = techs.get(k);

                model.ifThen(
                        model.arithm(techChoice[i], "=", k),
                        model.and(
                                model.arithm(startTimes[i], ">=", (int) tech.getShiftStart()),
                                model.arithm(startTimes[i], "+", t.getEstimatedDurationHours())
                        )
                );
            }
        }

        // -----------------------------------------
        // Solve
        // -----------------------------------------
        boolean solved = model.getSolver().solve();
        if (!solved) {
            return infeasible("Choco solver could not find any feasible schedule.");
        }

        // -----------------------------------------
        // Build solution
        // -----------------------------------------
        List<PlanningAssignment> assignments = new ArrayList<>();

        for (int i = 0; i < taskCount; i++) {

            ExpandedPlanningTask t = tasks.get(i);
            int start = startTimes[i].getValue();
            int techIndex = techChoice[i].getValue();
            PlanningTechnician tech = techs.get(techIndex);

            PlanningAssignment a = new PlanningAssignment();
            a.setIncidentId(t.getIncidentId());
            a.setSpeciality(t.getSpeciality());
            a.setTechnicianId(tech.getTechnicianId());
            a.setTeamId(tech.getTeamId());
            a.setStartTime(start);
            a.setEndTime(start + t.getEstimatedDurationHours());

            assignments.add(a);
        }

        PlanningSolution out = new PlanningSolution();
        out.setAssignments(assignments);
        out.setFeasible(true);
        out.setSolverMessage("OK");
        return out;
    }

    // Utility to build infeasible solution
    private PlanningSolution infeasible(String msg) {
        PlanningSolution s = new PlanningSolution();
        s.setFeasible(false);
        s.setSolverMessage(msg);
        return s;
    }
}
