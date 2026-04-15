package tn.intervenIA.intervenIA.application.mapper;

import org.springframework.stereotype.Component;
import tn.intervenIA.intervenIA.application.service.ai.AiResponse;
import tn.intervenIA.intervenIA.web.dto.incident.IncidentAiDTO;

@Component
public class IncidentAiMapper {

    public void applyAiResponse(IncidentAiDTO dto, AiResponse ai) {
        dto.setAiPredictedName(ai.getPredictedName());
        dto.setAiConfidence(ai.getConfidence());
        dto.setCitizenMessage(ai.getCitizenMessage());
    }
}
