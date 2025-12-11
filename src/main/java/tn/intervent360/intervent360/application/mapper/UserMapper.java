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
        userDTO.setTeam(user.getTeam());
        userDTO.setShiftStart(user.getShiftStart());
        userDTO.setShiftEnd(user.getShiftEnd());
        userDTO.setMaxDailyHours(user.getMaxDailyHours());
        return userDTO;
    }

    public static User toUser(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setUsername(userDTO.getUsername());
        user.setRole(userDTO.getRole());
        user.setSpeciality(userDTO.getSpeciality());
        return user;
    }
}
