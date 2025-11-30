package tn.intervent360.intervent360.application.mapper;

import tn.intervent360.intervent360.domain.model.planning.Planning;
import tn.intervent360.intervent360.web.dto.PlanningDTO;

public class PlanningMapper {
    public static PlanningDTO toDto(Planning planning) {
        if (planning == null) return null;
        PlanningDTO dto = new PlanningDTO();
        dto.setId(planning.getId());
        dto.setStartDate(planning.getStartDate());
        dto.setEndDate(planning.getEndDate());
        dto.setStatus(planning.getStatus());
        dto.setTeamIds(planning.getTeamIds());
        dto.setTechnicianIds(planning.getTechnicianIds());
        dto.setEquipmentIds(planning.getEquipmentIds());
        return dto;
    }
    public static Planning fromDto(PlanningDTO dto) {
        if (dto == null) return null;
        Planning planning = new Planning();
        planning.setId(dto.getId());
        planning.setStartDate(dto.getStartDate());
        planning.setEndDate(dto.getEndDate());
        planning.setStatus(dto.getStatus());
        planning.setTeamIds(dto.getTeamIds());
        planning.setTechnicianIds(dto.getTechnicianIds());
        planning.setEquipmentIds(dto.getEquipmentIds());
        return planning;
    }
}
