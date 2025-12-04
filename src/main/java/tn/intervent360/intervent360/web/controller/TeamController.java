package tn.intervent360.intervent360.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.intervent360.intervent360.application.service.team.TeamService;
import tn.intervent360.intervent360.domain.model.Zone;
import tn.intervent360.intervent360.web.dto.TeamDTO;

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
}

