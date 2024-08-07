package com.security.backendjwtauth.controllers;

import com.security.backendjwtauth.config.UserAuthProvider;
import com.security.backendjwtauth.dto.CredentialsDto;
import com.security.backendjwtauth.dto.SignUpDto;
import com.security.backendjwtauth.dto.UserDto;
import com.security.backendjwtauth.entities.Usuario;
import com.security.backendjwtauth.exceptions.AppException;
import com.security.backendjwtauth.services.UserService;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
public class AuthController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    private boolean ResultHasErrors(BindingResult result, Map<String, Object> response) {
        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El campo \"" + err.getField() + "\" " + err.getDefaultMessage())
                    .collect(Collectors.toList());
            response.put("errors", errors);
            return true;
        }
        return false;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid CredentialsDto credentialsDto) {
        Map<String, Object> response = new HashMap<>();
        UserDto user;
        try {
            user = userService.login(credentialsDto);
            user.setToken(userAuthProvider.createToken(user));

        } catch (AppException e) {
            response.put("mensaje", "Error al iniciar sesión");
            response.put("error", e.getMessage());
            //e.getStatus()
            return new ResponseEntity<>(response, e.getStatus());
        }
        response.put("mensaje", "El usuario fue loggeado con Éxito");
        response.put("user", user);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid SignUpDto user) {
        Map<String, Object> response = new HashMap<>();
        UserDto createdUser;
        try {
            createdUser = userService.register(user);
        } catch (AppException e) {
            response.put("mensaje", "Error al crear usuario");
            response.put("error", e.getStatus() + ": " + e.getMessage());
            return new ResponseEntity<>(response, e.getStatus());
        } catch (ConstraintViolationException e) {
            List<String> errors = e.getConstraintViolations()
                    .stream()
                    .map(violation -> "El campo '" + violation.getPropertyPath() + "' " + violation.getMessage())
                    .collect(Collectors.toList());
            response.put("mensaje", "Error al crear usuario");
            response.put("errors", errors);
            return ResponseEntity.badRequest().body(response);
        }
        response.put("mensaje", "El usuario fue registrado con Éxito");
        response.put("user", URI.create("/users/" + createdUser.getId()));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }




}