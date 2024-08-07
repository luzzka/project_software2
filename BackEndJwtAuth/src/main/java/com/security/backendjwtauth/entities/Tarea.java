package com.security.backendjwtauth.entities;
import com.security.backendjwtauth.dto.Estado;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Entity
@Getter
@Setter
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private Period plazoFinalizacion;

    @Column(nullable = false)
    private LocalDate fechaCreacion;

    @Column
    private LocalDate fechaFinalizacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado;

    @ManyToOne
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDate.now();
        fechaFinalizacion = fechaCreacion.plus(plazoFinalizacion);
    }
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "tarea_id")
    private List<Archivo> archivos;
}
