package tn.intervent360.intervent360.application.service.team;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.application.mapper.TeamMapper;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Team;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.domain.model.user.Role;
import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.domain.repository.TeamRepository;
import tn.intervent360.intervent360.domain.repository.UserRepository;
import tn.intervent360.intervent360.web.dto.TeamDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    // ---------------------------
    // CREATE TEAM
    // ---------------------------
    public TeamDTO create(TeamDTO dto) {

        User leader = userRepository.findById(dto.getLeaderId())
                .orElseThrow(() -> new RuntimeException("Leader not found"));

        if (leader.getRole() != Role.LEADER)
            throw new RuntimeException("User is not a leader");

        if (leader.getSpeciality() != dto.getSpeciality())
            throw new RuntimeException("Leader's speciality does not match the team speciality");

        Team team = TeamMapper.toEntity(dto);
        Team savedTeam = teamRepository.save(team);

        // Assign leader
        team.setLeaderId(leader.getId());
        savedTeam = teamRepository.save(savedTeam);

        // Assign team to technicians
        if (dto.getTechnicianIds() != null) {
            for (String techId : dto.getTechnicianIds()) {
                User tech = userRepository.findById(techId)
                        .orElseThrow(() -> new RuntimeException("Technician not found"));

                if (tech.getRole() != Role.TECHNICIAN)
                    throw new RuntimeException("User is not a technician");

                if (tech.getSpeciality() != dto.getSpeciality())
                    throw new RuntimeException("Technician speciality does not match team speciality");

                savedTeam.addTechnician(techId);
            }
            savedTeam = teamRepository.save(savedTeam);
        }

        return TeamMapper.toDTO(savedTeam);
    }

    // ---------------------------
    // ADD TECHNICIAN
    // ---------------------------
    public TeamDTO addTechnician(String teamId, String technicianId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User tech = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (tech.getSpeciality() != team.getSpeciality())
            throw new RuntimeException("Technician speciality does not match team's speciality");

        // Remove from old team if exists
        teamRepository.findByTechnicianIdsContains(technicianId).ifPresent(oldTeam -> {
            oldTeam.removeTechnician(technicianId);
            teamRepository.save(oldTeam);
        });

        // Add to new team
        team.addTechnician(technicianId);
        Team savedTeam = teamRepository.save(team);

        return TeamMapper.toDTO(savedTeam);
    }

    // ---------------------------
    // REMOVE TECHNICIAN
    // ---------------------------
    public TeamDTO removeTechnician(String teamId, String technicianId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.removeTechnician(technicianId);
        Team savedTeam = teamRepository.save(team);

        return TeamMapper.toDTO(savedTeam);
    }

    // ---------------------------
    // CHANGE LEADER
    // ---------------------------
    public TeamDTO changeLeader(String teamId, String newLeaderId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User newLeader = userRepository.findById(newLeaderId)
                .orElseThrow(() -> new RuntimeException("Leader not found"));

        if (newLeader.getRole() != Role.LEADER)
            throw new RuntimeException("User is not a leader");

        if (newLeader.getSpeciality() != team.getSpeciality())
            throw new RuntimeException("Leader's speciality does not match team speciality");

        // Assign new leader
        team.setLeaderId(newLeaderId);
        Team savedTeam = teamRepository.save(team);

        return TeamMapper.toDTO(savedTeam);
    }

    // ---------------------------
    // UPDATE TEAM ZONE
    // ---------------------------
    public TeamDTO updateZone(String teamId, Zone zone) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.setZone(zone);
        Team savedTeam = teamRepository.save(team);

        return TeamMapper.toDTO(savedTeam);
    }

    public List<TeamDTO> findAll() {
        return teamRepository .findAll() .stream() .map(TeamMapper::toDTO) .collect(Collectors.toList()); }

    public TeamDTO findById(String id) { Team team = teamRepository.findById(id) .orElseThrow(() -> new RuntimeException("Team not found"));
        return TeamMapper.toDTO(team); }

    public List<TeamDTO> findBySpeciality(ProfessionalSpeciality speciality) { List<Team> teams=teamRepository.getBySpeciality(speciality);
        return teams.stream().map(TeamMapper::toDTO).collect(Collectors.toList()); }

    public TeamDTO findByLeaderId(String leaderId) {
        Team team = teamRepository.findByLeaderId(leaderId) .orElseThrow(() -> new RuntimeException("Team not found"));
        return TeamMapper.toDTO(team); }


    public void delete(String teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // 1. Clear teamId on the leader
        if (team.getLeaderId() != null) {
            userRepository.findById(team.getLeaderId()).ifPresent(leader -> {
                leader.setTeamId(null);
                userRepository.save(leader);
            });
        }

        // 2. Clear teamId on all technicians
        for (String techId : team.getTechnicianIds()) {
            userRepository.findById(techId).ifPresent(tech -> {
                tech.setTeamId(null);
                userRepository.save(tech);
            });
        }

        // 3. Delete the team
        teamRepository.deleteById(teamId);
    }
}