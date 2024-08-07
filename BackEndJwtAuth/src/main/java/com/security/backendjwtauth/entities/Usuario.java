package com.security.backendjwtauth.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table
public class Usuario {

    @NotNull
    @Column(nullable = false)
    boolean esAdministrador;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false)
    @Size(max = 100)
    private String nombres;
    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false)
    @Size(max = 100)
    private String apellidos;
    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false,unique = true)
    @Size(max = 100)
    @Email
    private String correo;
    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false)
    @Size(max = 20)
    private String telefono;
    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false,unique = true)
    @Size(max = 50)
    private String login;
    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false)
    @Size(max = 100)
    private String password;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "usuario_id")
    private List<Proyecto> proyectos;
}