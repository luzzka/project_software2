package com.security.backendjwtauth.services;

import com.security.backendjwtauth.dao.I_ProyectoDao;
import com.security.backendjwtauth.entities.Proyecto;
import com.security.backendjwtauth.entities.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class I_ProyectoServiceImplementTest {
    @Mock
    private I_ProyectoDao proyectoDao;

    @InjectMocks
    private I_ProyectoServiceImplement proyectoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ========================================================================================================
    @Test
    @DisplayName("Encontrar todos los proyectos")
    void findAll() {
        List<Proyecto> proyectos = Arrays.asList(new Proyecto(), new Proyecto());
        when(proyectoDao.findAll()).thenReturn(proyectos);

        List<Proyecto> result = proyectoService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    // ========================================================================================================
    @Test
    @DisplayName("Encontrar proyecto por Id")
    void findById() {
        Proyecto proyecto = new Proyecto();
        when(proyectoDao.findById(1L)).thenReturn(Optional.of(proyecto));

        Proyecto result = proyectoService.findById(1L);

        assertNotNull(result);
    }

    // ========================================================================================================
    @Test
    @DisplayName("Devolver null si no encuentra el Id")
    void findById_NotFound() {
        when(proyectoDao.findById(1L)).thenReturn(Optional.empty());

        Proyecto result = proyectoService.findById(1L);

        assertNull(result);
    }

    // ========================================================================================================
    @Test
    @DisplayName("Guardar un proyecto")
    void save() {
        Proyecto proyecto = new Proyecto();
        when(proyectoDao.save(proyecto)).thenReturn(proyecto);

        Proyecto result = proyectoService.save(proyecto);

        assertNotNull(result);
    }

    // ========================================================================================================
    @Test
    @DisplayName("Eliminar un proyecto")
    void delete() {
        doNothing().when(proyectoDao).deleteById(1L);

        proyectoService.delete(1L);

        verify(proyectoDao, times(1)).deleteById(1L);
    }

    // ========================================================================================================
    @Test
    @DisplayName("Encontrar proyectos por usuario")
    void findByUsuario() {
        Usuario usuario = new Usuario();
        List<Proyecto> proyectos = Arrays.asList(new Proyecto(), new Proyecto());
        when(proyectoDao.findByUsuario(usuario)).thenReturn(proyectos);

        List<Proyecto> result = proyectoService.findByUsuario(usuario);

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("Encontrar proyectos por nombre de proyecto y usuario")
    void findByNombreProyectoAndUsuario() {
        Usuario usuario = new Usuario();
        List<Proyecto> proyectos = Arrays.asList(new Proyecto(), new Proyecto());
        when(proyectoDao.findByNombreProyectoAndUsuario("Proyecto 1", usuario)).thenReturn(proyectos);

        List<Proyecto> result = proyectoService.findByNombreProyectoAndUsuario("Proyecto 1", usuario);

        assertNotNull(result);
        assertEquals(2, result.size());
    }
}