package tn.intervent360.intervent360.application.service.team;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.intervent360.intervent360.application.mapper.TeamMapper;
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

    // ===========================================================
    //                     BASIC CRUD
    // ===========================================================

    public TeamDTO create(TeamDTO dto) {

        // check user exists and is a LEADER
        User user = userRepository.findById(dto.getLeaderId())
                .orElseThrow(() -> new RuntimeException("Leader not found"));
        if (user.getRole() != Role.LEADER)
            throw new RuntimeException("User is not a leader");

        if (user.getSpeciality() != dto.getSpeciality())
            throw new RuntimeException("Leader's speciality is not the same as the team's speciality");

        Team team = TeamMapper.toEntity(dto);
        Team saved = teamRepository.save(team);

        return TeamMapper.toDTO(saved);
    }

    public List<TeamDTO> findAll() {
        return teamRepository
                .findAll()
                .stream()
                .map(TeamMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TeamDTO findById(String id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return TeamMapper.toDTO(team);
    }

    public TeamDTO findByLeaderId(String leaderId) {
        Team team = teamRepository.findByLeaderId(leaderId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return TeamMapper.toDTO(team);
    }

    public void delete(String id) {
        if (!teamRepository.existsById(id))
            throw new RuntimeException("Team not found");
        teamRepository.deleteById(id);
    }

    // ===========================================================
    //                     BUSINESS LOGIC
    // ===========================================================


    public TeamDTO addTechnician(String teamId, String technicianId) {

        Team newTeam = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User tech = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (tech.getSpeciality()!=newTeam.getSpeciality())
            throw new RuntimeException("Technician speciality is not the same as team's speciality");


        // remove from old team
        teamRepository.findByTechnicianIdsContains(technicianId)
                .ifPresent(oldTeam -> {
                    oldTeam.getTechnicianIds().remove(technicianId);
                    teamRepository.save(oldTeam);
                });

        // add to new team
        newTeam.getTechnicianIds().add(technicianId);

        return TeamMapper.toDTO(teamRepository.save(newTeam));
    }



    public TeamDTO removeTechnician(String teamId, String technicianId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));


        User technician = userRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (technician.getRole() != Role.TECHNICIAN)
            throw new RuntimeException("User is not a technician");

        team.removeTechnician(technicianId);

        return TeamMapper.toDTO(teamRepository.save(team));
    }

    public TeamDTO changeLeader(String teamId, String newLeaderId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User leader = userRepository.findById(newLeaderId)
                .orElseThrow(() -> new RuntimeException("Leader not found"));

        if (leader.getRole() != Role.LEADER)
            throw new RuntimeException("User is not a leader");

        if (leader.getSpeciality() != team.getSpeciality())
            throw new RuntimeException("Leader's speciality is not the same as the team's speciality");

        team.setLeaderId(newLeaderId);
        return TeamMapper.toDTO(teamRepository.save(team));
    }


    public TeamDTO updateZone(String teamId, Zone zone) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setZone(zone);
        return TeamMapper.toDTO(teamRepository.save(team));
    }

}
