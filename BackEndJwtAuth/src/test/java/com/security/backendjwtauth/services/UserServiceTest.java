package com.security.backendjwtauth.services;

import com.security.backendjwtauth.dto.CredentialsDto;
import com.security.backendjwtauth.dto.SignUpDto;
import com.security.backendjwtauth.dto.UserDto;
import com.security.backendjwtauth.entities.Usuario;
import com.security.backendjwtauth.exceptions.AppException;
import com.security.backendjwtauth.mappers.UserMapper;
import com.security.backendjwtauth.repository.UserRepository;
import com.security.backendjwtauth.config.UserAuthProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.CharBuffer;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // =======================================================================================================
    @Test
    @DisplayName("Inicio de sesión exitoso")
    void login_Success() {
        CredentialsDto credentials = new CredentialsDto("usr1", "pass1".toCharArray());
        Usuario usuario = new Usuario();
        usuario.setLogin("usr1");
        usuario.setPassword("encodedPass");
        UserDto userDto = UserDto.builder()
                .login("usr1")
                .token("token")
                .build();

        when(userRepository.findByLogin(credentials.login())).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(any(CharSequence.class), anyString())).thenReturn(true);
        when(userMapper.toUserDto(usuario)).thenReturn(userDto);

        UserDto result = userService.login(credentials);

        assertNotNull(result);
        assertEquals("usr1", result.getLogin());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Excepción en el inicio de sesión")
    void login_Failure() {
        CredentialsDto credentials = new CredentialsDto("usr1", "wrongPass".toCharArray());

        when(userRepository.findByLogin(credentials.login())).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> userService.login(credentials));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Excepción en el inicio de sesión por contraseña incorrecta")
    void login_Failure_WrongPassword() {
        CredentialsDto credentials = new CredentialsDto("usr1", "wrongPass".toCharArray());
        Usuario usuario = new Usuario();
        usuario.setLogin("usr1");
        usuario.setPassword("encodedPass");

        when(userRepository.findByLogin(credentials.login())).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(any(CharSequence.class), anyString())).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> userService.login(credentials));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Registro nuevo usuario exitoso")
    void register_Success() {
        SignUpDto signUpDto = new SignUpDto("nombre", "apellido", "correo@gmail.com", "12345678", "usr1", "password", false);
        Usuario usuario = new Usuario();
        usuario.setLogin(signUpDto.login());
        UserDto userDto = UserDto.builder()
                .login(signUpDto.login())
                .token("token")
                .build();

        when(userRepository.findByLogin(signUpDto.login())).thenReturn(Optional.empty());
        when(userRepository.findByCorreo(signUpDto.correo())).thenReturn(Optional.empty());
        when(userMapper.signUpToUser(signUpDto)).thenReturn(usuario);
        when(passwordEncoder.encode(any(CharBuffer.class))).thenReturn("encodedPass");
        when(userRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(userMapper.toUserDto(usuario)).thenReturn(userDto);

        UserDto result = userService.register(signUpDto);

        assertNotNull(result);
        assertEquals(signUpDto.login(), result.getLogin());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Excepción al registrar usuario existente (login)")
    void register_Failure_LoginExists() {
        SignUpDto signUpDto = new SignUpDto("nombre", "apellido", "correo@gmail.com", "12345678", "usr1", "password", false);
        Usuario usuario = new Usuario();
        usuario.setLogin(signUpDto.login());

        when(userRepository.findByLogin(signUpDto.login())).thenReturn(Optional.of(usuario));

        AppException exception = assertThrows(AppException.class, () -> userService.register(signUpDto));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Excepción al registrar usuario existente (correo)")
    void register_Failure_CorreoExists() {
        SignUpDto signUpDto = new SignUpDto("nombre", "apellido", "correo@gmail.com", "12345678", "usr1", "password", false);
        Usuario usuario = new Usuario();
        usuario.setCorreo(signUpDto.correo());

        when(userRepository.findByCorreo(signUpDto.correo())).thenReturn(Optional.of(usuario));

        AppException exception = assertThrows(AppException.class, () -> userService.register(signUpDto));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Encontrar usuario por login exitoso")
    void findByLogin_Success() {
        Usuario usuario = new Usuario();
        usuario.setLogin("usr1");
        UserDto userDto = UserDto.builder()
                .login("usr1")
                .token("token")
                .build();

        when(userRepository.findByLogin("usr1")).thenReturn(Optional.of(usuario));
        when(userMapper.toUserDto(usuario)).thenReturn(userDto);

        UserDto result = userService.findByLogin("usr1");

        assertNotNull(result);
        assertEquals("usr1", result.getLogin());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Excepción cuando no encuentra usuario por login")
    void findByLogin_Failure() {
        when(userRepository.findByLogin("usr1")).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> userService.findByLogin("usr1"));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Encontrar usuario Completo por login")
    void findByLogin_fullbody_Success() {
        Usuario usuario = new Usuario();
        usuario.setLogin("usr1");

        when(userRepository.findByLogin("usr1")).thenReturn(Optional.of(usuario));

        Usuario result = userService.findByLogin_fullbody("usr1");

        assertNotNull(result);
        assertEquals("usr1", result.getLogin());
    }

    // =======================================================================================================
    @Test
    @DisplayName("Excepción cuando no encuentra login (usuario completo)")
    void findByLogin_fullbody_Failure() {
        when(userRepository.findByLogin("usr1")).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> userService.findByLogin_fullbody("usr1"));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
    }
}
