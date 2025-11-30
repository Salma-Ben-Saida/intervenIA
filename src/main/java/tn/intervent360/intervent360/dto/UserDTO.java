package tn.intervent360.intervent360.dto;

import lombok.Data;
import tn.intervent360.intervent360.domain.model.user.Role;

@Data
public class UserDTO {
    private String id;
    private String email;
    private String username;
    private String password;
    private Role role;
    private Boolean isAvailable;

}
