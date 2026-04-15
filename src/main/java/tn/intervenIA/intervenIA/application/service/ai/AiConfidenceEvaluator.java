package tn.intervenIA.intervenIA.application.service.ai;

import org.springframework.stereotype.Component;

@Component
public class AiConfidenceEvaluator {

    private static final int CONFIDENCE_THRESHOLD = 85;

    /**
     * Returns true if the AI output is considered reliable
     * enough to auto-validate the incident.
     */
    public boolean isReliable(float confidence) {
        return confidence >= CONFIDENCE_THRESHOLD;
    }
}

