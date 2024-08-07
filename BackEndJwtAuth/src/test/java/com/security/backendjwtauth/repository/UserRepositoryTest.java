package com.security.backendjwtauth.repository;

import com.security.backendjwtauth.dto.SignUpDto;
import com.security.backendjwtauth.dto.UserDto;
import com.security.backendjwtauth.entities.Usuario;
import com.security.backendjwtauth.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class UserRepositoryTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // =========================================================================== findByLogin TESTS
    @Test
    @DisplayName("Buscar por usuario cuando el usuario SI existe")
    void findByLogin_UserExists() {
        // dado --------------------------------------------
        Usuario usuario = new Usuario();
        usuario.setLogin("usr1");
        usuario.setPassword("pass1");

        // llama a findByLogin de usr1,
        // y debe retornar un objeto de la clase optional, igual al objeto usuario que cree
        when(userRepository.findByLogin("usr1")).thenReturn(Optional.of(usuario));

        // cuando -------------------------------------------
        Optional<Usuario> foundUsuario = userRepository.findByLogin("usr1");

        // entonces -----------------------------------------
        assertTrue(foundUsuario.isPresent());
        assertEquals("usr1", foundUsuario.get().getLogin());
    }


    @Test
    @DisplayName("Buscar por usuario cuando el usuario NO existe")
    void findByLogin_UserDoesNotExist() {
        // Arrange
        when(userRepository.findByLogin("usr1")).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> foundUsuario = userRepository.findByLogin("nonexistent");

        // Assert
        assertFalse(foundUsuario.isPresent());
    }

    // =========================================================================== findByCorreo TESTS
    @Test
    @DisplayName("Buscar por correo cuando el correo SI existe")
    void findByCorreo_UserExists() {
        // dado ----------------------------------------------
        Usuario usuario = new Usuario();
        usuario.setLogin("usr1");
        usuario.setCorreo("usr1@gmail.com");

        when(userRepository.findByCorreo("usr1@gmail.com")).thenReturn(Optional.of(usuario));

        // cuando --------------------------------------------
        Optional<Usuario> foundUsuario = userRepository.findByCorreo("usr1@gmail.com");

        // entonces ------------------------------------------
        assertTrue(foundUsuario.isPresent());
        assertEquals("usr1@gmail.com", foundUsuario.get().getCorreo());
    }


    @Test
    @DisplayName("Buscar por correo cuando el correo NO existe")
    void findByCorreo_UserDoesNotExist() {
        // dado ----------------------------------------------
        when(userRepository.findByCorreo("nonexistent@gmail.com")).thenReturn(Optional.empty());

        // cuando --------------------------------------------
        Optional<Usuario> foundUsuario = userRepository.findByCorreo("nonexistent@gmail.com");

        // entonces ------------------------------------------
        assertFalse(foundUsuario.isPresent());
    }
}