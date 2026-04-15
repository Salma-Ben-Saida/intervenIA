package tn.intervenIA.intervenIA.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.intervenIA.intervenIA.application.service.team.TeamService;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;
import tn.intervenIA.intervenIA.web.dto.TeamDTO;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    // ===========================================================
    //                       CRUD
    // ===========================================================

    @PostMapping
    public TeamDTO create(@RequestBody TeamDTO dto) {
        return teamService.create(dto);
    }

    @GetMapping
    public List<TeamDTO> findAll() {
        return teamService.findAll();
    }

    @GetMapping("/{id}")
    public TeamDTO findById(@PathVariable String id) {
        return teamService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        teamService.delete(id);
    }

    // ===========================================================
    //                   BUSINESS LOGIC
    // ===========================================================

    @PostMapping("/{teamId}/add-technician/{technicianId}")
    public TeamDTO addTechnician(
            @PathVariable String teamId,
            @PathVariable String technicianId
    ) {
        return teamService.addTechnician(teamId, technicianId);
    }

    @DeleteMapping("/{teamId}/remove-technician/{technicianId}")
    public TeamDTO removeTechnician(
            @PathVariable String teamId,
            @PathVariable String technicianId
    ) {
        return teamService.removeTechnician(teamId, technicianId);
    }

    @PutMapping("/{teamId}/leader/{leaderId}")
    public TeamDTO changeLeader(@PathVariable String teamId,
                                @PathVariable String leaderId) {
        return teamService.changeLeader(teamId, leaderId);
    }

    @PutMapping("/{teamId}/zone")
    public TeamDTO updateZone(
            @PathVariable String teamId,
            @RequestParam Zone zone) {
        return teamService.updateZone(teamId, zone);
    }

    @GetMapping("/speciality/{speciality}")
    public List<TeamDTO> findBySpeciality(@PathVariable ProfessionalSpeciality speciality) {
        return teamService.findBySpeciality(speciality);
    }

    @GetMapping("/leader/{leaderId}")
    public TeamDTO findByLeaderId(@PathVariable String leaderId){
        return teamService.findByLeaderId(leaderId);
    }
}

