package tn.intervent360.intervent360.application.mapper;

import org.springframework.stereotype.Component;
import tn.intervent360.intervent360.application.service.ai.AiResponse;
import tn.intervent360.intervent360.web.dto.incident.IncidentAiDTO;

@Component
public class IncidentAiMapper {

    public void applyAiResponse(IncidentAiDTO dto, AiResponse ai) {
        dto.setAiPredictedName(ai.getPredictedName());
        dto.setAiConfidence(ai.getConfidence());
        dto.setCitizenMessage(ai.getCitizenMessage());
    }
}
