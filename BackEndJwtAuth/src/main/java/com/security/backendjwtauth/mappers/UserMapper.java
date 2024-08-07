package com.security.backendjwtauth.mappers;


import com.security.backendjwtauth.dto.SignUpDto;
import com.security.backendjwtauth.dto.UserDto;
import com.security.backendjwtauth.entities.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(Usuario user);

    @Mapping(target = "password",ignore = true)
    Usuario signUpToUser(SignUpDto userDto);


}