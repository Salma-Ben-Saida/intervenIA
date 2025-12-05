package tn.intervent360.intervent360.application.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service in charge of sending a classification request
 * to LLaMA Cloud and converting the result into a structured AiResponse.
 */
@Service
@RequiredArgsConstructor
public class AiIncidentClassifier {

    private final AiPromptBuilder promptBuilder;
    private final AiImageHandler imageHandler;
    private final AiConfidenceEvaluator confidenceEvaluator;

    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate rest = new RestTemplate();

    private static final String OLLAMA_CLOUD_URL = "https://ollama.com/api/generate";
    private static final String MODEL_NAME = "gpt-oss:120b";
    private static final String API_KEY = "49a6b6921e6d44ee8938bf26d0f21b31.RqMzaOd1xVgQzLf7iT3uYGZH";

    /**
     * Main AI method: builds prompt, sends request, parses response.
     */
    public AiResponse classifyIncident(String description, List<String> photosBase64) {

        String prompt = promptBuilder.buildIncidentPrompt(description, photosBase64);

        String rawResponse = callModel(prompt);

        String json = extractJson(rawResponse);

        return AiResponse.fromJson(json);
    }

    /**
     * Calls Ollama Cloud’s “/api/generate” endpoint.
     */
    private String callModel(String prompt) {

        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL_NAME);
        body.put("prompt", prompt);
        body.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Ollama Cloud uses a token header:
        headers.set("Authorization", "Bearer " + API_KEY);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = rest.exchange(
                    OLLAMA_CLOUD_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Ollama Cloud error: " + e.getMessage());
        }
    }

    /**
     * Extracts the model output from Ollama:
     *
     * Ollama returns:
     * {
     *   "model": "...",
     *   "created_at": "...",
     *   "response": "{ ... JSON ... }"
     * }
     */
    /*private String extractJson(String raw) {
        try {
            JsonNode node = mapper.readTree(raw);
            return node.get("response").asText();
        } catch (Exception e) {
            throw new RuntimeException("Invalid AI response: " + raw);
        }
    }*/
    private String extractJson(String raw) {
        StringBuilder sb = new StringBuilder();

        try {
            // Ollama returns multiple JSON objects separated by newlines
            String[] lines = raw.split("\n");

            for (String line : lines) {
                JsonNode node = mapper.readTree(line.trim());

                if (node.has("response") && !node.get("response").isNull()) {
                    sb.append(node.get("response").asText());
                }
            }

            return sb.toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse streaming AI response: " + raw);
        }
    }



    public String extractCitizenMessage(String raw) {
        int startIndex = raw.indexOf("<CITIZEN_MESSAGE>");
        int endIndex = raw.indexOf("</CITIZEN_MESSAGE>");

        if (startIndex == -1 || endIndex == -1) return null;

        startIndex += "<CITIZEN_MESSAGE>".length();
        return raw.substring(startIndex, endIndex).trim();
    }


}
