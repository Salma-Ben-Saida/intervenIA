package tn.intervent360.intervent360.application.service.planning.builder;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.service.planning.expansion.ExpandedPlanningTask;
import tn.intervent360.intervent360.application.service.planning.expansion.TaskExpander;
import tn.intervent360.intervent360.domain.model.incident.Incident;
import tn.intervent360.intervent360.domain.model.incident.IncidentStatus;
import tn.intervent360.intervent360.domain.model.planning.*;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.domain.repository.IncidentRepository;
import tn.intervent360.intervent360.domain.repository.TeamRepository;
import tn.intervent360.intervent360.domain.repository.UserRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Builds a complete PlanningProblem for the solver.
 *
 * Responsibilities:
 *  - Load incidents
 *  - Transform each one into a PlanningTask
 *  - Expand multi-speciality tasks into atomic ExpandedPlanningTask
 *  - Load teams and technicians
 *  - Build solver-ready data for ChocoPlanningSolver
 *
 * This class is used both for:
 *  - weekly batch planning
 *  - emergency-only planning
 *
 * This class does NOT solve anything.
 * It only prepares the complete problem definition.
 */
@Component
@RequiredArgsConstructor
public class PlanningProblemBuilder {

    private final IncidentRepository incidentRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TaskExpander taskExpander;

    /**
     * Builds the full weekly planning problem.
     * Includes all pending incidents + all available technicians/teams.
     */
    public PlanningProblem buildWeeklyProblem() {

        List<Incident> incidents =
                incidentRepository.findByIncidentStatusIn(List.of(IncidentStatus.PENDING, IncidentStatus.IN_PROGRESS));

        return buildProblemFromIncidents(incidents);
    }

    /**
     * Builds a problem for one emergency incident.
     * Only includes one incident + all technicians that match zone & speciality.
     */
    public PlanningProblem buildEmergencyProblem(String incidentId) {

        Optional<Incident> opt = incidentRepository.findById(incidentId);

        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Incident not found: " + incidentId);
        }

        return buildProblemFromIncidents(List.of(opt.get()));
    }

    /**
     * Core builder logic used by both weekly and emergency planning.
     */
    private PlanningProblem buildProblemFromIncidents(List<Incident> incidents) {

        List<PlanningTask> baseTasks = new ArrayList<>();

        for (Incident inc : incidents) {
            baseTasks.add(toTask(inc));
        }

        // Expand multi-speciality → atomic tasks
        List<ExpandedPlanningTask> expanded = new ArrayList<>();
        for (PlanningTask t : baseTasks) {
            expanded.addAll(taskExpander.expand(t));
        }

        // Load teams & technicians
        List<PlanningTeam> planningTeams = loadTeams();
        List<PlanningTechnician> planningTechs = loadTechnicians();


        PlanningProblem problem = new PlanningProblem();
        problem.setTasks(expanded);
        problem.setTeams(planningTeams);
        problem.setTechnicians(planningTechs);
        problem.setPlanningHorizonHours(168); // 1 week

        return problem;
    }

    /**
     * Converts domain Incident → base PlanningTask.
     */
    private PlanningTask toTask(Incident inc) {

        long now = Instant.now().toEpochMilli();
        long deadline = Instant.now().plus(24, ChronoUnit.HOURS).toEpochMilli();

        return new PlanningTask(
                inc.getId(),
                inc.getZone(),
                inc.getSpeciality(),  // list of required specialities
                estimateDuration(inc),
                computePriority(inc),
                now,
                deadline
        );
    }

    /**
     * Converts ExpandedPlanningTask → PlanningTask for solver.
     */
    private List<PlanningTask> convertExpanded(List<ExpandedPlanningTask> expanded) {

        List<PlanningTask> result = new ArrayList<>();

        for (ExpandedPlanningTask e : expanded) {

            PlanningTask t = new PlanningTask(
                    e.getIncidentId(),
                    e.getZone(),
                    List.of(e.getSpeciality()),
                    e.getEstimatedDurationHours(),
                    e.getPriority(),
                    e.getEarliestStart(),
                    e.getDeadline()
            );

            // Replace computed equipment
            t.setRequiredEquipment(e.getRequiredEquipment());

            result.add(t);
        }

        return result;
    }

    /**
     * Convert DB Team → PlanningTeam.
     */
    private List<PlanningTeam> loadTeams() {
        return teamRepository.findAll()
                .stream()
                .map(team -> {
                    PlanningTeam pt = new PlanningTeam();
                    pt.setTeamId(team.getId());
                    pt.setName(team.getName());
                    pt.setSpeciality(team.getSpeciality());
                    pt.setZone(team.getZone());
                    pt.setTechnicianIds(team.getTechnicianIds());
                    return pt;
                })
                .toList();
    }

    /**
     * Convert DB User → PlanningTechnician.
     */
    private List<PlanningTechnician> loadTechnicians() {

        return userRepository.findByRole(Role.TECHNICIAN)
                .stream()
                .map(this::toPlanningTechnician)
                .toList();
    }

    private PlanningTechnician toPlanningTechnician(User tech) {

        PlanningTechnician p = new PlanningTechnician();

        p.setTechnicianId(tech.getId());
        p.setTeamId(tech.getTeam().getId());
        p.setSpeciality(tech.getSpeciality());
        p.setZone(tech.getTeam().getZone());
        p.setAvailable(Boolean.TRUE.equals(tech.getIsAvailable()));

        p.setMaxDailyHours(tech.getMaxDailyHours());
        p.setCurrentAssignedHours(0);

        if (tech.getShiftStart() != null) {
            p.setShiftStart(tech.getShiftStart().getTime());
        }

        if (tech.getShiftEnd() != null) {
            p.setShiftEnd(tech.getShiftEnd().getTime());
        }

        return p;
    }

    // ------------------------------
    // Utility estimation methods
    // ------------------------------

    private int estimateDuration(Incident inc) {
        return switch (inc.getUrgencyLevel()) {
            case CRITICAL -> 4;
            case HIGH -> 3;
            case MEDIUM -> 2;
            default -> 1;
        };
    }

    private int computePriority(Incident inc) {
        return switch (inc.getUrgencyLevel()) {
            case CRITICAL -> 100;
            case HIGH -> 70;
            case MEDIUM -> 40;
            default -> 10;
        };
    }
}
