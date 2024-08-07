package com.security.backendjwtauth.services;

import com.security.backendjwtauth.entities.Proyecto;
import com.security.backendjwtauth.entities.Usuario;

import java.util.List;

public interface I_ProyectoService {

    List<Proyecto> findAll();

    Proyecto findById(Long id);

    Proyecto save(Proyecto proyecto);

    void delete(Long id);

    List<Proyecto> findByUsuario(Usuario usuario);

    List<Proyecto> findByNombreProyectoAndUsuario(String nombreProyecto, Usuario usuario);
}
