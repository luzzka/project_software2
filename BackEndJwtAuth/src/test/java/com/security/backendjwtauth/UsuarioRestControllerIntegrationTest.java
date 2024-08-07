package com.security.backendjwtauth;

import com.security.backendjwtauth.entities.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UsuarioRestControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;
    /*
    @Test
    public void testGetUsuario() {
        ResponseEntity<String> response = restTemplate.getForEntity("/api/usuario/johndoe", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("johndoe");
    }*/
}