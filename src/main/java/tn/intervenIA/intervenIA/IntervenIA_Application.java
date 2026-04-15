package tn.intervenIA.intervenIA;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Objects;

@SpringBootApplication
public class IntervenIA_Application {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();

        System.setProperty("INTERVENIA_MONGO_URI", Objects.requireNonNull(dotenv.get("INTERVENIA_MONGO_URI")));
        System.setProperty("INTERVENIA_JWT_SECRET", Objects.requireNonNull(dotenv.get("INTERVENIA_JWT_SECRET")));
        SpringApplication.run(IntervenIA_Application.class, args);
    }

}
