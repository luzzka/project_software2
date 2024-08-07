package com.security.backendjwtauth.dto;

import jakarta.validation.constraints.NotBlank;

public record SignUpDto (
        String nombres,
        String apellidos,
        String correo,
        String telefono,
        String login,
        @NotBlank(message = "La contraseña no puede ser vacía")
        String password,
        boolean esAdministrador) { }