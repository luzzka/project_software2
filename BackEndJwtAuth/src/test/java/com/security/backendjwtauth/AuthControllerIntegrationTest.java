package com.security.backendjwtauth;

import com.security.backendjwtauth.dto.CredentialsDto;
import com.security.backendjwtauth.dto.SignUpDto;
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
public class AuthControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    /*
    @Test
    public void testRegister() {
        SignUpDto signUpDto = new SignUpDto("John", "Doe", "john@example.com", "123456789", "johndoe", "password", false);
        HttpEntity<SignUpDto> request = new HttpEntity<>(signUpDto);
        ResponseEntity<String> response = restTemplate.postForEntity("/register", request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).contains("El usuario fue registrado con Éxito");
    }

    @Test
    public void testLogin() {
        CredentialsDto credentialsDto = new CredentialsDto("johndoe", "password".toCharArray());
        HttpEntity<CredentialsDto> request = new HttpEntity<>(credentialsDto);
        ResponseEntity<String> response = restTemplate.postForEntity("/login", request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("El usuario fue loggeado con Éxito");
    }*/
}