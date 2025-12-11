package tn.intervent360.intervent360.domain.model.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import tn.intervent360.intervent360.domain.model.team.ProfessionalSpeciality;
import tn.intervent360.intervent360.domain.model.team.Team;

import java.util.Calendar;
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
    Date shiftStart;

    @Getter @Setter
    Date shiftEnd;

    @Getter @Setter
    int maxDailyHours;


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

    public User(String email, String username, String password, Role role, ProfessionalSpeciality speciality) {
        this.id = UUID.randomUUID().toString();
        this.username = username;
        this.email = email;
        this.password = hashPassword(password);
        this.role = role;
        this.speciality=speciality;

        //By default, a new Technician is available when added
        this.isAvailable = (role == Role.TECHNICIAN);
    }

    public void setDefaultShifts() {
        if (this.role == Role.TECHNICIAN) {
            Calendar calStart = Calendar.getInstance();
            calStart.set(Calendar.HOUR_OF_DAY, 8);
            calStart.set(Calendar.MINUTE, 0);
            calStart.set(Calendar.SECOND, 0);
            calStart.set(Calendar.MILLISECOND, 0);

            Calendar calEnd = Calendar.getInstance();
            calEnd.set(Calendar.HOUR_OF_DAY, 16);
            calEnd.set(Calendar.MINUTE, 0);
            calEnd.set(Calendar.SECOND, 0);
            calEnd.set(Calendar.MILLISECOND, 0);

            this.shiftStart = calStart.getTime();
            this.shiftEnd = calEnd.getTime();
        }

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

        // If the role changes, availability rule changes
        if (role != Role.TECHNICIAN) {
            this.isAvailable = null;
        }
    }

    public void setIsAvailable(Boolean available) {
        if (this.role == Role.TECHNICIAN) {
            this.isAvailable = available;
        }
    }
}

