package tn.intervent360.intervent360.application.service.planning.builder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.service.equipment.EquipmentService;
import tn.intervent360.intervent360.application.service.planning.expansion.ExpandedPlanningTask;
import tn.intervent360.intervent360.application.service.planning.expansion.TaskExpander;
import tn.intervent360.intervent360.domain.model.incident.*;
import tn.intervent360.intervent360.domain.model.planning.*;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.domain.repository.IncidentRepository;
import tn.intervent360.intervent360.domain.repository.TeamRepository;
import tn.intervent360.intervent360.domain.repository.UserRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import tn.intervent360.intervent360.domain.model.team.Team;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlanningProblemBuilder {

    private final IncidentRepository incidentRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TaskExpander taskExpander;
    private final EquipmentService equipmentService;

    // =====================================================
    // PUBLIC ENTRY POINTS
    // =====================================================

    public PlanningProblem buildWeeklyProblem() {
        List<Incident> incidents =
                incidentRepository.findByIncidentStatusIn(
                        List.of(IncidentStatus.PENDING, IncidentStatus.IN_PROGRESS)
                );
        return buildProblem(incidents, false);
    }

    public PlanningProblem buildEmergencyProblem(String incidentId) {
        Incident inc = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found"));
        return buildProblem(List.of(inc), true);
    }

    // =====================================================
    // CORE BUILDER
    // =====================================================

    private PlanningProblem buildProblem(List<Incident> incidents, boolean emergencyMode) {

        Instant planningStart = Instant.now();
        List<ExpandedPlanningTask> expandedTasks = new ArrayList<>();

        for (Incident inc : incidents) {

            int earliestHour;
            int deadlineHour;

            boolean criticalEmergency =
                    inc.getIncidentType() == IncidentType.EMERGENCY &&
                            inc.getUrgencyLevel() == UrgencyLevel.CRITICAL;

            earliestHour = 0;// ✅ allow anytime
            if (criticalEmergency) {
                // 🚨 must start NOW
                deadlineHour = 6;
            } else {
                deadlineHour = earliestHour + urgencyToHours(inc.getUrgencyLevel())
                        - estimateDuration(inc);
            }

            PlanningTask base = new PlanningTask(
                    inc.getId(),
                    inc.getZone(),
                    inc.getSpeciality(),
                    estimateDuration(inc),
                    computePriority(inc),
                    earliestHour,
                    deadlineHour,
                    inc.getIncidentType(),
                    inc.getUrgencyLevel()
            );

            List<ExpandedPlanningTask> tasksForIncident =
                    taskExpander.expand(base, inc);

            if (tasksForIncident.isEmpty()) {
                continue;
            }

            // CHECK EQUIPMENT AVAILABILITY
            boolean equipmentOk =
                    equipmentService.hasEnoughEquipment(tasksForIncident, base.getZone());

            if (!equipmentOk) {

                // 👉 Decision point (choose ONE strategy)
                // -------------------------------------

                if (emergencyMode) {
                    // emergency overrides equipment shortages
                    log.warn(
                            "Equipment shortage overridden for emergency incident {}",
                            inc.getId()
                    );
                } else {
                    // skip this incident for now
                    log.warn(
                            "Incident {} skipped due to insufficient equipment",
                            inc.getId()
                    );
                    continue;
                }
            }

            expandedTasks.addAll(tasksForIncident);


        }

        PlanningProblem problem = new PlanningProblem();
        problem.setPlanningStart(planningStart);
        problem.setPlanningHorizonHours(168);
        problem.setTasks(expandedTasks);
        problem.setTeams(loadTeams());
        problem.setTechnicians(loadTechnicians());

        return problem;
    }

    // =====================================================
    // TECHNICIANS
    // =====================================================

    private List<PlanningTechnician> loadTechnicians() {

        List<User> users = userRepository.findByRole(Role.TECHNICIAN);
        List<PlanningTechnician> out = new ArrayList<>();

        // Preload teams into a map for quick lookups
        Map<String, Team> teamMap = teamRepository.findAll().stream()
                .collect(Collectors.toMap(Team::getId, t -> t));

        for (User u : users) {
            if (u.getTeamId() == null) continue;
            if (!Boolean.TRUE.equals(u.getIsAvailable())) continue;

            Team team = teamMap.get(u.getTeamId());
            if (team == null) continue;

            PlanningTechnician p = new PlanningTechnician();
            p.setTechnicianId(u.getId());
            p.setTeamId(team.getId());
            p.setSpeciality(u.getSpeciality());
            p.setZone(team.getZone());
            p.setAvailable(true);
            p.setMaxDailyHours(u.getMaxDailyHours());
            p.setWeeklyHoursAssigned(0);

            boolean allowedOnCall =
                    u.getSpeciality() == ProfessionalSpeciality.EMERGENCY ||
                            u.getSpeciality() == ProfessionalSpeciality.FIRE_SAFETY ||
                            u.getSpeciality() == ProfessionalSpeciality.GAZ ||
                            u.getSpeciality() == ProfessionalSpeciality.ELECTRICITY;

            p.setOnCall(Boolean.TRUE.equals(u.getOnCall()) && allowedOnCall);

            // 👇 SHIFT LOGIC (VERY IMPORTANT)
            if (u.getShiftStart() == 0 && u.getShiftEnd() == 0) {
                // ON-CALL ONLY
                p.setShiftStart(-1);
                p.setShiftEnd(-1);
            } else {
                p.setShiftStart(u.getShiftStart());
                p.setShiftEnd(u.getShiftEnd());
            }


            out.add(p);
        }
        return out;
    }

    // =====================================================
    // TEAMS
    // =====================================================

    private List<PlanningTeam> loadTeams() {
        return teamRepository.findAll().stream().map(team -> {
            PlanningTeam pt = new PlanningTeam();
            pt.setTeamId(team.getId());
            pt.setName(team.getName());
            pt.setZone(team.getZone());
            pt.setSpeciality(team.getSpeciality());
            pt.setTechnicianIds(team.getTechnicianIds());
            return pt;
        }).toList();
    }

    // =====================================================
    // HELPERS
    // =====================================================

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

    private int urgencyToHours(UrgencyLevel u) {
        return switch (u) {
            case HIGH -> 24;
            case MEDIUM -> 48;
            case LOW -> 120;
            default -> 168;
        };
    }
}
