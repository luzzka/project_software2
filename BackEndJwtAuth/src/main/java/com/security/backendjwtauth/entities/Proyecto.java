package com.security.backendjwtauth.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.security.backendjwtauth.dto.Tipo;
import com.security.backendjwtauth.dto.Estado;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;


@Entity
@Table(
        name = "Proyecto",
        uniqueConstraints = @UniqueConstraint(columnNames = {"nombreProyecto", "descripcionProyecto"})
)
@Getter
@Setter
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false)
    private String nombreProyecto;

    @NotBlank(message = "no puede estar vacío")
    @Column(nullable = false)
    private String descripcionProyecto;

    @NotNull(message = "no puede estar vacío")
    @Temporal(TemporalType.DATE)
    private Date fechaInicioProyecto;

    @NotNull(message = "no puede estar vacío")
    @Temporal(TemporalType.DATE)
    private Date fechaFinProyecto;

    @NotNull(message = "no puede estar vacío")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    @NotNull(message = "no puede estar vacío")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tarea> tareas;
}