package com.security.backendjwtauth.services;

import java.nio.CharBuffer;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

import com.security.backendjwtauth.dto.CredentialsDto;
import com.security.backendjwtauth.dto.SignUpDto;
import com.security.backendjwtauth.dto.UserDto;
import com.security.backendjwtauth.entities.Usuario;
import com.security.backendjwtauth.exceptions.AppException;
import com.security.backendjwtauth.mappers.UserMapper;
import com.security.backendjwtauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    private int loginAttempts = 0;
    private LocalDateTime lastFailedAttempt;

    public UserDto login(CredentialsDto credentialsDto) {
        if (loginAttempts >= 3 && lastFailedAttempt != null && lastFailedAttempt.plusMinutes(5).isAfter(LocalDateTime.now())) {
            Duration timeRemaining = Duration.between(LocalDateTime.now(), lastFailedAttempt.plusMinutes(5));
            long minutes = timeRemaining.toMinutes();
            long seconds = timeRemaining.minusMinutes(minutes).getSeconds();
            throw new AppException("Máximo de intentos excedido. Intente después de " + minutes + " min " + seconds + " s", HttpStatus.TOO_MANY_REQUESTS);
        }

        Usuario user = userRepository.findByLogin(credentialsDto.login())
                .orElseThrow(() -> {
                    loginAttempts++;
                    lastFailedAttempt = LocalDateTime.now();
                    if (loginAttempts >= 3) {
                        lastFailedAttempt = LocalDateTime.now();
                    }
                    return new AppException("Usuario Desconocido. Contraseña Desconocida. Quedan " + (3 - loginAttempts) + " intentos", HttpStatus.BAD_REQUEST);
                });

        if (passwordEncoder.matches(CharBuffer.wrap(credentialsDto.password()), user.getPassword())) {
            loginAttempts = 0;
            return userMapper.toUserDto(user);
        } else {
            loginAttempts++;
            lastFailedAttempt = LocalDateTime.now();
            if (loginAttempts >= 3) {
                lastFailedAttempt = LocalDateTime.now();
            }
            throw new AppException("Contraseña Desconocida. Quedan " + (3 - loginAttempts) + " intentos", HttpStatus.BAD_REQUEST);
        }
    }


    public UserDto register(SignUpDto userDto) {
        Optional<Usuario> optionalUserByLogin = userRepository.findByLogin(userDto.login());
        Optional<Usuario> optionalUserByEmail = userRepository.findByCorreo(userDto.correo());

        if (optionalUserByLogin.isPresent()) {
            throw new AppException("Ya existe este usuario", HttpStatus.BAD_REQUEST);
        }

        if (optionalUserByEmail.isPresent()) {
            throw new AppException("El correo ya ha sido registrado", HttpStatus.BAD_REQUEST);
        }

        Usuario user = userMapper.signUpToUser(userDto);

        // Convertir el password de String a char[]
        char[] passwordChars = userDto.password().toCharArray();

        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(passwordChars)));

        Usuario savedUser = userRepository.save(user);

        return userMapper.toUserDto(savedUser);
    }

    public UserDto findByLogin(String login) {
        Usuario user = userRepository.findByLogin(login)
                .orElseThrow(() -> new AppException("Usuario desconocido", HttpStatus.NOT_FOUND));
        return userMapper.toUserDto(user);
    }

    public Usuario findByLogin_fullbody(String login) {
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new AppException("Usuario desconocido", HttpStatus.NOT_FOUND));
    }

}