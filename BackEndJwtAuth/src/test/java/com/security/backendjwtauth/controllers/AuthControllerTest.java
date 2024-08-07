package com.security.backendjwtauth.controllers;

import com.security.backendjwtauth.config.UserAuthProvider;
import com.security.backendjwtauth.dto.CredentialsDto;
import com.security.backendjwtauth.dto.SignUpDto;
import com.security.backendjwtauth.dto.UserDto;
import com.security.backendjwtauth.exceptions.AppException;
import com.security.backendjwtauth.services.UserService;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.net.URI;
import java.util.HashSet;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserAuthProvider userAuthProvider;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // =============================================================================================
    @Test
    @DisplayName("Inicio de sesión exitoso")
    void login_Success() {
        char[] password = "pass1".toCharArray();
        CredentialsDto credentialsDto = new CredentialsDto("usr1", password);
        UserDto userDto = new UserDto();
        userDto.setToken("token");

        when(userService.login(credentialsDto)).thenReturn(userDto);
        when(userAuthProvider.createToken(userDto)).thenReturn("token");

        ResponseEntity<?> response = authController.login(credentialsDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertEquals("El usuario fue loggeado con Éxito", responseBody.get("mensaje"));
        assertEquals(userDto, responseBody.get("user"));
    }

    // =============================================================================================
    @Test
    @DisplayName("Error al iniciar sesión")
    void login_AppException() {
        // dado
        char[] password = "pass1".toCharArray();
        CredentialsDto credentialsDto = new CredentialsDto("usr1", password);
        AppException appException = new AppException("Error al iniciar sesión", HttpStatus.UNAUTHORIZED);

        when(userService.login(credentialsDto)).thenThrow(appException);

        ResponseEntity<?> response = authController.login(credentialsDto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertEquals("Error al iniciar sesión", responseBody.get("mensaje"));
        assertEquals("Error al iniciar sesión", responseBody.get("error"));
    }

    // =============================================================================================
    @Test
    @DisplayName("Registrar usuario con éxito")
    void register_Success() {
        // dado
        SignUpDto signUpDto = new SignUpDto(
                "nombre1",
                "apellido1",
                "usr1@gmail.com",
                "1234567890",
                "usr1",
                "password",
                true
        );
        UserDto userDto = new UserDto();
        userDto.setId(1L);

        when(userService.register(signUpDto)).thenReturn(userDto);

        // cuando
        ResponseEntity<?> response = authController.register(signUpDto);

        // entonces
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertEquals("El usuario fue registrado con Éxito", responseBody.get("mensaje"));
        assertEquals(URI.create("/users/" + userDto.getId()), responseBody.get("user"));
    }


    // =============================================================================================
    @Test
    @DisplayName("AppException error al registrar usuario")
    void register_AppException() {
        // dado
        SignUpDto signUpDto = new SignUpDto(
                "Nombre",
                "Apellido",
                "usr1@gmail.com",
                "1234567890",
                "usr1",
                "password",
                true
        );
        AppException appException = new AppException("Error al crear usuario", HttpStatus.CONFLICT);

        when(userService.register(signUpDto)).thenThrow(appException);

        ResponseEntity<?> response = authController.register(signUpDto);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertEquals("Error al crear usuario", responseBody.get("mensaje"));
        assertEquals("409 CONFLICT: Error al crear usuario", responseBody.get("error"));
    }

    // =============================================================================================
    @Test
    @DisplayName("Debería manejar error de validación al registrar usuario")
    void register_ConstraintViolationException() {
        // dado
        SignUpDto signUpDto = new SignUpDto(
                "Nombre",
                "Apellido",
                "usr1@gmail.com",
                "1234567890",
                "usr1",
                "password",
                true
        );
        ConstraintViolationException violationException = new ConstraintViolationException(new HashSet<>());

        when(userService.register(signUpDto)).thenThrow(violationException);

        ResponseEntity<?> response = authController.register(signUpDto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertEquals("Error al crear usuario", responseBody.get("mensaje"));
        assertNotNull(responseBody.get("errors"));
    }
}