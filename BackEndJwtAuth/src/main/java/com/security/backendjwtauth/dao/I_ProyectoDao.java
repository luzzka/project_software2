package com.security.backendjwtauth.dao;

import com.security.backendjwtauth.entities.Proyecto;
import com.security.backendjwtauth.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface I_ProyectoDao extends JpaRepository<Proyecto, Long> {
    List<Proyecto> findByUsuario(Usuario usuario);

    @Query("SELECT p FROM Proyecto p WHERE p.usuario = :usuario AND p.nombreProyecto = :nombreProyecto")
    List<Proyecto> findByNombreProyectoAndUsuario(@Param("nombreProyecto") String nombreProyecto, @Param("usuario") Usuario usuario);
}

