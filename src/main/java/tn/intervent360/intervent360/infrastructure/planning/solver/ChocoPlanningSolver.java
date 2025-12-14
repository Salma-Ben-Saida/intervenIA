package tn.intervent360.intervent360.infrastructure.planning.solver;

import lombok.extern.slf4j.Slf4j;
import org.chocosolver.solver.Model;
import org.chocosolver.solver.variables.BoolVar;
import org.chocosolver.solver.variables.IntVar;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.service.planning.expansion.ExpandedPlanningTask;
import tn.intervent360.intervent360.domain.model.planning.*;
import tn.intervent360.intervent360.domain.model.incident.IncidentType;
import tn.intervent360.intervent360.domain.model.incident.UrgencyLevel;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class ChocoPlanningSolver {

    public PlanningSolution solve(PlanningProblem problem) {

        List<ExpandedPlanningTask> tasks = problem.getTasks();
        List<PlanningTechnician> techs   = problem.getTechnicians();

        int taskCount = tasks.size();
        int techCount = techs.size();
        int horizon   = problem.getPlanningHorizonHours();

        Model model = new Model("Intervent360 Solver");

        // Start time = hours since planningStart
        IntVar[] start   = model.intVarArray("start", taskCount, 0, horizon);
        IntVar[] techVar = model.intVarArray("tech", taskCount, 0, techCount - 1);

        // =================================================
        // TASK → TECH + TIME CONSTRAINTS
        // =================================================
        for (int i = 0; i < taskCount; i++) {

            ExpandedPlanningTask task = tasks.get(i);
            int duration = task.getEstimatedDurationHours();

            boolean criticalEmergency =
                    task.getIncidentType() == IncidentType.EMERGENCY &&
                            task.getUrgencyLevel() == UrgencyLevel.CRITICAL;

            // ----------------------------
            // Compatible technicians
            // ----------------------------
            List<Integer> validTechs = new ArrayList<>();

            for (int k = 0; k < techCount; k++) {
                PlanningTechnician tech = techs.get(k);

                boolean ok =
                        tech.isAvailable() &&
                                tech.getZone() == task.getZone() &&
                                tech.getSpeciality() == task.getSpeciality() &&
                                tech.getWeeklyHoursAssigned() + duration <= tech.getMaxDailyHours() * 7;

                if (ok) validTechs.add(k);
            }

            if (validTechs.isEmpty()) {
                log.warn(
                        "No tech for incident={}, spec={}, zone={}, window=[{},{}]",
                        task.getIncidentId(),
                        task.getSpeciality(),
                        task.getZone(),
                        task.getEarliestStartHour(),
                        task.getDeadlineHour()
                );
                return infeasible("No valid technicians for this mission.");
            }

            techVar[i] = model.intVar(
                    "tech_" + i,
                    validTechs.stream().mapToInt(Integer::intValue).toArray()
            );

            // ----------------------------
            // Time window
            // ----------------------------
            model.arithm(start[i], ">=", task.getEarliestStartHour()).post();
            model.arithm(start[i], "<=", task.getDeadlineHour()).post();

            // ----------------------------
            // SHIFT + ON-CALL LOGIC
            // ----------------------------
            int days = horizon / 24;

            for (int k : validTechs) {
                PlanningTechnician tech = techs.get(k);

                List<BoolVar> allowed = new ArrayList<>();

                int shiftStart = tech.getShiftStart();
                int shiftEnd   = tech.getShiftEnd();

                // -------- NORMAL SHIFTS --------
                if (shiftStart >= 0 && shiftEnd >= 0) {

                    // Day / Evening shift (e.g. 07 → 15, 13 → 20)
                    if (shiftEnd > shiftStart) {
                        for (int d = 0; d <= days; d++) {
                            int ws = d * 24 + shiftStart;
                            int we = d * 24 + (shiftEnd - duration);
                            if (we < ws) continue;

                            BoolVar ge = model.arithm(start[i], ">=", ws).reify();
                            BoolVar le = model.arithm(start[i], "<=", we).reify();
                            allowed.add(model.and(ge, le).reify());
                        }
                    }
                    // Night shift (20 → 04)
                    else {
                        for (int d = 0; d <= days; d++) {

                            // 20 → 24
                            int ws1 = d * 24 + shiftStart;
                            int we1 = d * 24 + 24 - duration;

                            if (we1 >= ws1) {
                                BoolVar ge = model.arithm(start[i], ">=", ws1).reify();
                                BoolVar le = model.arithm(start[i], "<=", we1).reify();
                                allowed.add(model.and(ge, le).reify());
                            }

                            // 00 → 04
                            int ws2 = (d + 1) * 24;
                            int we2 = (d + 1) * 24 + (shiftEnd - duration);

                            if (we2 >= ws2) {
                                BoolVar ge = model.arithm(start[i], ">=", ws2).reify();
                                BoolVar le = model.arithm(start[i], "<=", we2).reify();
                                allowed.add(model.and(ge, le).reify());
                            }
                        }
                    }
                }

                // -------- ON-CALL GAP (04 → 07) --------
                if (tech.isOnCall() && criticalEmergency) {
                    for (int d = 0; d <= days; d++) {
                        int ws = d * 24 + 4;
                        int we = d * 24 + (7 - duration);
                        if (we < ws) continue;

                        BoolVar ge = model.arithm(start[i], ">=", ws).reify();
                        BoolVar le = model.arithm(start[i], "<=", we).reify();
                        allowed.add(model.and(ge, le).reify());
                    }
                }

                if (!allowed.isEmpty()) {
                    BoolVar any = model.or(allowed.toArray(new BoolVar[0])).reify();
                    model.ifThen(
                            model.arithm(techVar[i], "=", k),
                            model.arithm(any, "=", 1)
                    );
                }
            }
        }

        // =================================================
        // NO OVERLAP FOR SAME TECH
        // =================================================
        for (int a = 0; a < taskCount; a++) {
            for (int b = a + 1; b < taskCount; b++) {

                int durA = tasks.get(a).getEstimatedDurationHours();
                int durB = tasks.get(b).getEstimatedDurationHours();

                IntVar endA = start[a].add(durA).intVar();
                IntVar endB = start[b].add(durB).intVar();

                BoolVar sameTech = model.arithm(techVar[a], "=", techVar[b]).reify();
                BoolVar aBefore  = model.arithm(endA, "<=", start[b]).reify();
                BoolVar bBefore  = model.arithm(endB, "<=", start[a]).reify();

                model.ifThen(sameTech, model.or(aBefore, bBefore));
            }
        }

        // =================================================
        // OBJECTIVE: earlier is better
        // =================================================
        IntVar totalStart = model.intVar("totalStart", 0, horizon * taskCount);
        model.sum(start, "=", totalStart).post();
        model.setObjective(Model.MINIMIZE, totalStart);

        // =================================================
        // SOLVE
        // =================================================
        if (!model.getSolver().solve()) {
            return infeasible("Choco solver could not find any feasible schedule.");
        }

        // =================================================
        // BUILD RESULT (INT → INSTANT)
        // =================================================
        Instant planningStart = problem.getPlanningStart();
        List<PlanningAssignment> assignments = new ArrayList<>();

        for (int i = 0; i < taskCount; i++) {

            ExpandedPlanningTask task = tasks.get(i);
            PlanningTechnician tech   = techs.get(techVar[i].getValue());

            int s = start[i].getValue();
            int e = s + task.getEstimatedDurationHours();

            PlanningAssignment a = new PlanningAssignment();
            a.setIncidentId(task.getIncidentId());
            a.setSpeciality(task.getSpeciality());
            a.setTeamId(tech.getTeamId());
            a.setTechnicianId(tech.getTechnicianId());
            a.setStartTime(planningStart.plus(s, ChronoUnit.HOURS));
            a.setEndTime(planningStart.plus(e, ChronoUnit.HOURS));
            a.setStatus(PlanningStatus.SCHEDULED);

            assignments.add(a);
        }

        PlanningSolution sol = new PlanningSolution();
        sol.setAssignments(assignments);
        sol.setFeasible(true);
        sol.setSolverMessage("OK");
        return sol;
    }

    private PlanningSolution infeasible(String msg) {
        PlanningSolution p = new PlanningSolution();
        p.setFeasible(false);
        p.setSolverMessage(msg);
        return p;
    }
}
