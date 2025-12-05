package tn.intervent360.intervent360.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.intervent360.intervent360.application.mapper.IncidentAiMapper;
import tn.intervent360.intervent360.application.service.ai.AiIncidentClassifier;
import tn.intervent360.intervent360.web.dto.incident.IncidentAiDTO;
import tn.intervent360.intervent360.web.dto.incident.IncidentDTO;

@RestController
@RequestMapping("/api/ai/incidents")
@RequiredArgsConstructor
public class AiIncidentController {

    private final AiIncidentClassifier classifier;
    private final IncidentAiMapper mapper;

    @PostMapping("/classify")
    public ResponseEntity<IncidentAiDTO> classifyIncident(@RequestBody IncidentAiDTO dto) {

        //   Call LLM model
        var aiResponse = classifier.classifyIncident(dto.getDescription(), dto.getPhotos());


        mapper.applyAiResponse(dto, aiResponse);

        //   IMPORTANT → if UNKNOWN, the user must decide in UI.
        //   We don't create an incident entity here.

        return ResponseEntity.ok(dto);
    }
}

