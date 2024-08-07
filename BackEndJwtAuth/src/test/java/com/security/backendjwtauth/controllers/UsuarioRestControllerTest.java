package com.security.backendjwtauth.controllers;

import com.security.backendjwtauth.entities.Usuario;
import com.security.backendjwtauth.exceptions.AppException;
import com.security.backendjwtauth.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class UsuarioRestControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UsuarioRestController usuarioRestController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ===================================================================================
    @Test
    @DisplayName("Mostrar login existente")
    void show_UserExists() {
        // dado
        String login = "usr1";
        Usuario usuario = new Usuario();
        usuario.setLogin(login);
        usuario.setCorreo("usr1@gmail.com");

        when(userService.findByLogin_fullbody(login)).thenReturn(usuario);

        // cuando
        ResponseEntity<?> responseEntity = usuarioRestController.show(login);

        // entonces
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(usuario, responseEntity.getBody());
    }

    // ===================================================================================
    @Test
    @DisplayName("Error 404 cuando usuario no existe")
    void show_UserDoesNotExist() {
        // dado
        String login = "nonexistentUser";

        when(userService.findByLogin_fullbody(login)).thenReturn(null);

        // cuando
        ResponseEntity<?> responseEntity = usuarioRestController.show(login);

        // entonces
        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) responseEntity.getBody();
        assertEquals("El usuario con el login: nonexistentUser no existe.", responseBody.get("mensaje"));
    }

    // ===================================================================================
    @Test
    @DisplayName("Error 500 si hay un error de acceso a datos")
    void show_DataAccessException() {
        // dado
        String login = "usr1";
        DataAccessException dataAccessException = new DataAccessException("Data access error") {};

        when(userService.findByLogin_fullbody(login)).thenThrow(dataAccessException);

        // cuando
        ResponseEntity<?> responseEntity = usuarioRestController.show(login);

        // entonces
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, responseEntity.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) responseEntity.getBody();
        assertEquals("Error al realizar la consulta en la base de datos", responseBody.get("mensaje"));
        assertTrue(responseBody.get("error").toString().contains("Data access error"));
    }

    // ===================================================================================
    @Test
    @DisplayName("Devolver al estado HTTP adecuado cuando AppException")
    void show_AppException() {
        // dado
        String login = "usr1";
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR; // El estado HTTP que deseas asociar con la excepción
        AppException appException = new AppException("App exception error", status);

        when(userService.findByLogin_fullbody(login)).thenThrow(appException);

        // cuando
        ResponseEntity<?> responseEntity = usuarioRestController.show(login);

        // entonces
        assertEquals(status, responseEntity.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) responseEntity.getBody();
        assertEquals("Error al realizar la operación", responseBody.get("mensaje"));
        assertEquals("App exception error", responseBody.get("error"));
    }



}