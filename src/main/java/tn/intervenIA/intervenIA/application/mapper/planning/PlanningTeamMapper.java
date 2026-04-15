package tn.intervenIA.intervenIA.application.mapper.planning;

import tn.intervenIA.intervenIA.domain.model.planning.PlanningTeam;
import tn.intervenIA.intervenIA.web.dto.planning.TeamDTO;

public class PlanningTeamMapper {

    public static TeamDTO toDTO(PlanningTeam team) {

        TeamDTO dto = new TeamDTO();

        dto.setId(team.getTeamId());
        dto.setName(team.getName());
        dto.setSpeciality(team.getSpeciality());
        dto.setZone(team.getZone());
        dto.setTechnicianIds(team.getTechnicianIds());
        dto.setLeaderId(null); // You can resolve leader from domain if needed

        return dto;
    }
}
