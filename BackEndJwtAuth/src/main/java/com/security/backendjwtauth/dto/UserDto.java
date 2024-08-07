package com.security.backendjwtauth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String nombres;
    private String apellidos;
    private String correo;
    private String telefono;
    private String login;
    private String password;
    boolean esAdministrador;
    private String token;
}