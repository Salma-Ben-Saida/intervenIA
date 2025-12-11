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
import java.util.Optional;
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

        // 1. Validate leader
        User leader = userRepository.findById(dto.getLeaderId())
                .orElseThrow(() -> new RuntimeException("Leader not found"));

        if (leader.getRole() != Role.LEADER)
            throw new RuntimeException("User is not a leader");

        if (leader.getSpeciality() != dto.getSpeciality())
            throw new RuntimeException("Leader's speciality does not match the team speciality");

        // 2. Create and save the team (generate real ID)
        Team team = TeamMapper.toEntity(dto);
        Team savedTeam = teamRepository.save(team);

        // 3. Assign team to leader
        leader.setTeam(savedTeam);
        userRepository.save(leader);

        // 4. Assign team to technicians
        if (dto.getTechnicianIds() != null) {
            for (String technicianId : dto.getTechnicianIds()) {

                User technician = userRepository.findById(technicianId)
                        .orElseThrow(() -> new RuntimeException("Technician not found"));


                if (technician.getRole() != Role.TECHNICIAN) {
                    teamRepository.deleteById(savedTeam.getId());
                    throw new RuntimeException("User is not a technician");

                }

                if (technician.getSpeciality() != dto.getSpeciality()) {
                    teamRepository.deleteById(savedTeam.getId());
                    throw new RuntimeException("Technician speciality does not match team speciality");
                }

                // Add technician ID in team
                savedTeam.addTechnician(technicianId);

                // Embed team object inside technician
                technician.setTeam(savedTeam);
                userRepository.save(technician);
            }

            // Save the updated technician list
            savedTeam = teamRepository.save(savedTeam);

            //  Assign team to leader
            leader.setTeam(savedTeam);
            userRepository.save(leader);
        }

        return TeamMapper.toDTO(savedTeam);
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

    public List<TeamDTO> findBySpeciality(ProfessionalSpeciality speciality) {
        List<Team> teams=teamRepository.getBySpeciality(speciality);
        return teams.stream().map(TeamMapper::toDTO).collect(Collectors.toList());
    }

    public TeamDTO findByLeaderId(String leaderId) {
        Team team = teamRepository.findByLeaderId(leaderId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return TeamMapper.toDTO(team);
    }

    public void delete(String teamId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // 1. Clear leader.team
        if (team.getLeaderId() != null) {
            userRepository.findById(team.getLeaderId()).ifPresent(leader -> {
                leader.setTeam(null);
                userRepository.save(leader);
            });
        }

        // 2. Clear technician.team for all technicians in this team
        for (String techId : team.getTechnicianIds()) {
            userRepository.findById(techId).ifPresent(tech -> {
                tech.setTeam(null);
                userRepository.save(tech);
            });
        }

        // 3. Delete the team itself
        teamRepository.deleteById(teamId);
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
                    oldTeam.removeTechnician(technicianId);
                    // clear embedded team from user
                    tech.setTeam(null);
                    teamRepository.save(oldTeam);
                });

        // add to new team
        newTeam.addTechnician(technicianId);
        tech.setTeam(newTeam);
        userRepository.save(tech);

        teamRepository.save(newTeam);

        // update team object in leader if exists
        if (newTeam.getLeaderId() != null) {
            userRepository.findById(newTeam.getLeaderId()).ifPresent(leader -> {
                leader.setTeam(newTeam);
                userRepository.save(leader);
            });
        }

        return TeamMapper.toDTO(teamRepository.save(newTeam));
    }



    public TeamDTO removeTechnician(String teamId, String technicianId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User tech = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (tech.getRole() != Role.TECHNICIAN)
            throw new RuntimeException("User is not a technician");

        // remove from team
        team.removeTechnician(technicianId);
        Team savedTeam = teamRepository.save(team);

        // remove embedded team object from technician
        tech.setTeam(null);
        userRepository.save(tech);

        // update embedded team object for leader
        if (savedTeam.getLeaderId() != null) {
            userRepository.findById(savedTeam.getLeaderId()).ifPresent(leader -> {
                leader.setTeam(savedTeam);
                userRepository.save(leader);
            });
        }

        return TeamMapper.toDTO(savedTeam);
    }


    public TeamDTO changeLeader(String teamId, String newLeaderId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        User newLeader = userRepository.findById(newLeaderId)
                .orElseThrow(() -> new RuntimeException("Leader not found"));

        if (newLeader.getRole() != Role.LEADER)
            throw new RuntimeException("User is not a leader");

        if (newLeader.getSpeciality() != team.getSpeciality())
            throw new RuntimeException("Leader's speciality does not match team speciality");

        // remove team from old leader
        if (team.getLeaderId() != null) {
            userRepository.findById(team.getLeaderId()).ifPresent(oldLeader -> {
                oldLeader.setTeam(null);
                userRepository.save(oldLeader);
            });
        }

        // assign new leader
        team.setLeaderId(newLeaderId);
        Team savedTeam = teamRepository.save(team);

        // update embedded team object in new leader
        newLeader.setTeam(savedTeam);
        userRepository.save(newLeader);

        // update embedded team object in all technicians
        for (String techId : savedTeam.getTechnicianIds()) {
            userRepository.findById(techId).ifPresent(tech -> {
                tech.setTeam(savedTeam);
                userRepository.save(tech);
            });
        }

        return TeamMapper.toDTO(savedTeam);
    }



    public TeamDTO updateZone(String teamId, Zone zone) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.setZone(zone);
        Team savedTeam = teamRepository.save(team);

        // update embedded team in leader
        if (savedTeam.getLeaderId() != null) {
            userRepository.findById(savedTeam.getLeaderId()).ifPresent(leader -> {
                leader.setTeam(savedTeam);
                userRepository.save(leader);
            });
        }

        // update embedded team in all technicians
        for (String techId : savedTeam.getTechnicianIds()) {
            userRepository.findById(techId).ifPresent(tech -> {
                tech.setTeam(savedTeam);
                userRepository.save(tech);
            });
        }

        return TeamMapper.toDTO(savedTeam);
    }


}
