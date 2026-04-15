package tn.intervenIA.intervenIA.application.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import tn.intervenIA.intervenIA.domain.model.incident.IncidentName;

/**
 * Represents a classification result returned by LLaMA Cloud.
 * Converts the raw JSON response into strongly typed enums.
 */
@Data
public class AiResponse {

    private IncidentName predictedName;
    private float confidence;
    private String citizenMessage;

    /**
     * Parses and converts the JSON returned by LLaMA Cloud into a usable AiResponse.
     *
     * Expected JSON format:
     * {
     *   "incident_name": "FIRE_START",
     *   "confidence": 91,
     *   "citizenMessage: "..."
     * }
     */


    public static AiResponse fromJson(String raw) {

        // Extract <JSON> ... </JSON>
        String jsonBlock = extractBetween(raw, "<JSON>", "</JSON>");
        if (jsonBlock == null) {
            throw new RuntimeException("AI returned invalid JSON block: " + raw);
        }

        // Extract <CITIZEN_MESSAGE> ... </CITIZEN_MESSAGE>
        String citizenMessage = extractBetween(raw, "<CITIZEN_MESSAGE>", "</CITIZEN_MESSAGE>");
        if (citizenMessage == null) {
            citizenMessage = ""; // optional
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(jsonBlock);

            AiResponse response = new AiResponse();
            response.setPredictedName(IncidentName.valueOf(node.get("incident_name").asText()));
            response.setConfidence(node.get("confidence").floatValue());
            response.setCitizenMessage(citizenMessage);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON block: " + jsonBlock, e);
        }
    }

    private static String extractBetween(String text, String start, String end) {
        int s = text.indexOf(start);
        int e = text.indexOf(end);
        if (s == -1 || e == -1 || e < s) return null;
        return text.substring(s + start.length(), e).trim();
    }

}
