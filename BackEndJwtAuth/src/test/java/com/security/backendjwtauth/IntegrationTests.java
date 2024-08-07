package com.security.backendjwtauth;

import com.security.backendjwtauth.dto.CredentialsDto;
import com.security.backendjwtauth.dto.SignUpDto;
import com.security.backendjwtauth.dto.UserDto;
import com.security.backendjwtauth.entities.Proyecto;
import com.security.backendjwtauth.services.I_ProyectoService;
import com.security.backendjwtauth.services.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class IntegrationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private I_ProyectoService proyectoService;

    @Before
    public void setup() {
    }
/*
    @Test

    public void testLoginEndpoint() {
        CredentialsDto credentialsDto = new CredentialsDto("usuario", "contraseña".toCharArray());
        ResponseEntity<UserDto> response = restTemplate.postForEntity("/login", credentialsDto, UserDto.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("usuario", response.getBody().getLogin());
    }

    @Test
    public void testRegisterEndpoint() {
        SignUpDto signUpDto = new SignUpDto("Nombre", "Apellido", "correo@example.com", "12345678", "nuevoUsuario", "contraseña", false);
        ResponseEntity<UserDto> response = restTemplate.postForEntity("/register", signUpDto, UserDto.class);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("nuevoUsuario", response.getBody().getLogin());
    }
*/
    @Test
    public void testGetAllProyectos() {
        ResponseEntity<List<Proyecto>> response = restTemplate.exchange("/api/proyectos", HttpMethod.GET, null,
                new ParameterizedTypeReference<List<Proyecto>>() {});
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());
    }

}
