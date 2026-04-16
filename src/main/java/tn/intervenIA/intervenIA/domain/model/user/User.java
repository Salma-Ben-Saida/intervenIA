package tn.intervenIA.intervenIA.domain.model.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import tn.intervenIA.intervenIA.domain.model.Zone;
import tn.intervenIA.intervenIA.domain.model.team.ProfessionalSpeciality;

import java.util.UUID;

@Document(collection = "users")
@CompoundIndexes({
        @CompoundIndex(name = "user_role_available_spec_idx", def = "{role:1, isAvailable:1, speciality:1}"),
        @CompoundIndex(name = "user_team_available_idx", def = "{teamId:1, isAvailable:1}"),
        @CompoundIndex(name = "user_manager_scope_idx", def = "{role: 1, managedZone: 1}")
})
public class User {

    @Getter
    @Id
    private String id;

    @Setter
    @Getter
    @Indexed(unique = true)
    private String email;

    @Getter @Setter @Indexed
    private String username;
    @Getter @Setter
    private String password; // stored hashed
    @Getter @Setter @Indexed
    private Role role;

    @Getter @Setter
    private String teamId;

    @Getter @Setter
    private int shiftStart;

    @Getter @Setter
    private int shiftEnd;

    @Getter @Setter
    private int maxDailyHours;

    @Getter @Setter
    private Boolean onCall; // only for technicians (onCall missions: 4am -> 7am)

    //Only for technicians and leaders, ignored for others
    @Getter @Setter @Indexed
    private ProfessionalSpeciality speciality;

    // Only for technicians, ignored for others
    @Getter @Setter
    private Boolean isAvailable;

    // Only meaningful when role == MANAGER (nullable for other roles)
    @Getter @Setter
    private Zone managedZone;

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
        this.password = password;
        this.role = role;
        this.speciality = speciality;

        //By default, a new Technician is available when added
        this.isAvailable = (role == Role.TECHNICIAN);
        this.onCall = onCall;

        this.shiftStart = shiftStart;
        this.shiftEnd = shiftEnd;
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

