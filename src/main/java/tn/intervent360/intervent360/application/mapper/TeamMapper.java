package tn.intervent360.intervent360.application.mapper;


import tn.intervent360.intervent360.domain.model.team.Team;
import tn.intervent360.intervent360.web.dto.TeamDTO;

public class TeamMapper {

    public static TeamDTO toDTO(Team team) {
        if (team == null) return null;

        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setLeaderId(team.getLeaderId());
        dto.setSpeciality(team.getSpeciality());
        dto.setZone(team.getZone());

        if (dto.getTechnicianIds() != null) {
            team.getTechnicianIds().addAll(dto.getTechnicianIds());
        }

        return dto;
    }

    public static Team toEntity(TeamDTO dto) {
        if (dto == null) return null;

        Team team = new Team();
        team.setId(dto.getId());
        team.setLeaderId(dto.getLeaderId());
        team.setSpeciality(dto.getSpeciality());
        team.setZone(dto.getZone());

        if (dto.getTechnicianIds() != null) {
            team.getTechnicianIds().addAll(dto.getTechnicianIds());
        }

        return team;
    }
}

