package tn.intervent360.intervent360.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.planning.PlanningStatus;

import java.util.Date;
import java.util.List;

@Data
public class PlanningDTO {
    private String id;
    private String incidentId;
    private Date startDate;
    private Date endDate;
    private PlanningStatus status;
    private List<String> teamIds;
    private List<String> technicianIds;
    private List<String> equipmentIds;

}
