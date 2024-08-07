package com.security.backendjwtauth.controllers;


import com.security.backendjwtauth.config.UserAuthProvider;
import com.security.backendjwtauth.entities.Usuario;
import com.security.backendjwtauth.exceptions.AppException;
import com.security.backendjwtauth.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("api/usuario")
public class UsuarioRestController {

    private final UserService userService;

    public UsuarioRestController(UserService userService, UserAuthProvider userAuthProvider) {
        this.userService = userService;
    }

    @GetMapping("/{login}")
    public ResponseEntity<?> show(@PathVariable String login) {
        Usuario usuario;
        Map<String, Object> response = new HashMap<>();

        try {
            usuario = userService.findByLogin_fullbody(login);

            if (usuario == null) {
                response.put("mensaje", "El usuario con el login: " + login + " no existe.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar la consulta en la base de datos");
            response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (AppException e) {
            response.put("mensaje", "Error al realizar la operación");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }
}
