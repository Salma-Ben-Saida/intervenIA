package tn.intervent360.intervent360;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class Intervent360Application {

    public static void main(String[] args) {
        SpringApplication.run(Intervent360Application.class, args);
    }

}
