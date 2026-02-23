package tn.intervent360.intervent360.application.mapper;

import tn.intervent360.intervent360.domain.model.user.User;
import tn.intervent360.intervent360.web.dto.UserDTO;

public class UserMapper {
    public static UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(null);
        userDTO.setRole(user.getRole());
        userDTO.setIsAvailable(user.getIsAvailable());
        userDTO.setSpeciality(user.getSpeciality());
        userDTO.setTeamId(user.getTeamId());
        userDTO.setShiftStart(user.getShiftStart());
        userDTO.setShiftEnd(user.getShiftEnd());
        userDTO.setMaxDailyHours(user.getMaxDailyHours());
        userDTO.setOnCall(user.getOnCall());
        // Manager scope
        userDTO.setManagedZone(user.getManagedZone());
        userDTO.setManagedSpeciality(user.getManagedSpeciality());
        return userDTO;
    }

    public static User toUser(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setUsername(userDTO.getUsername());
        user.setRole(userDTO.getRole());
        user.setSpeciality(userDTO.getSpeciality());
        user.setOnCall(userDTO.getOnCall());
        user.setShiftStart(userDTO.getShiftStart());
        user.setShiftEnd(userDTO.getShiftEnd());
        user.setMaxDailyHours(userDTO.getMaxDailyHours());
        user.setIsAvailable(userDTO.getIsAvailable());
        user.setTeamId(userDTO.getTeamId());
        user.setOnCall(userDTO.getOnCall());
        // Manager scope
        user.setManagedZone(userDTO.getManagedZone());
        user.setManagedSpeciality(userDTO.getManagedSpeciality());

        return user;
    }
}
