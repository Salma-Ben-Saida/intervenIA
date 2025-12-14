package tn.intervent360.intervent360.domain.model.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Team;

import java.util.Date;
import java.util.UUID;

@Document(collection = "users")
public class User {

    @Getter
    @Id
    private String id;

    @Setter
    @Getter
    @Indexed(unique = true)
    private String email;

    @Getter @Setter
    private String username;
    @Getter
    private String password; // stored hashed
    @Getter
    private Role role;

    @Getter @Setter
    Team team;

    @Getter @Setter
    String teamId;

    @Getter @Setter
    int shiftStart;

    @Getter @Setter
    int shiftEnd;

    @Getter @Setter
    int maxDailyHours;

    @Getter @Setter
    private Boolean onCall; // only for technicians (onCall missions: 4am -> 7am)


    //Only for technicians and leaders, ignored for others
    @Getter @Setter
    private ProfessionalSpeciality speciality;

    // Only for technicians, ignored for others
    @Getter
    private Boolean isAvailable;

    // -----------------------------
    // Constructors
    // -----------------------------
    public User() {
        this.id = UUID.randomUUID().toString();
    }

    public User(String email, String username, String password, Role role, ProfessionalSpeciality speciality, Boolean onCall, int shiftStart, int shiftEnd) {
        this.id = UUID.randomUUID().toString();
        this.username = username;
        this.email = email;
        this.password = hashPassword(password);
        this.role = role;
        this.speciality=speciality;

        //By default, a new Technician is available when added
        this.isAvailable = (role == Role.TECHNICIAN);
        this.onCall = onCall;

        this.shiftStart = shiftStart;
        this.shiftEnd = shiftEnd;
    }

    // -----------------------------
    // Password hashing
    // -----------------------------
    private String hashPassword(String rawPassword) {
        return new BCryptPasswordEncoder().encode(rawPassword);
    }

    public boolean checkPassword(String rawPassword) {
        return new BCryptPasswordEncoder().matches(rawPassword, this.password);
    }

    // -----------------------------
    // Getters & Setters
    // -----------------------------

    public void setPassword(String rawPassword) {
        this.password = hashPassword(rawPassword);
    }

    public void setRole(Role role) {
        this.role = role;

        this.isAvailable = (role == Role.TECHNICIAN);

    }

    public void setIsAvailable(Boolean available) {
        if (this.role == Role.TECHNICIAN) {
            this.isAvailable = available;
        }
    }
}

