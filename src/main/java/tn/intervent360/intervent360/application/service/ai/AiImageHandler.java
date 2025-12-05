package tn.intervent360.intervent360.application.service.ai;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AiImageHandler {

    /**
     * Ensures image Base64 list is safely handled.
     */
    public List<String> prepareImages(List<String> rawPhotos) {
        return rawPhotos == null ? List.of() : rawPhotos;
    }
}


