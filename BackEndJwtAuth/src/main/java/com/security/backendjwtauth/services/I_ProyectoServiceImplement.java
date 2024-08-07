package com.security.backendjwtauth.services;

import com.security.backendjwtauth.dao.I_ProyectoDao;
import com.security.backendjwtauth.entities.Proyecto;
import com.security.backendjwtauth.entities.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class I_ProyectoServiceImplement implements I_ProyectoService {

    private final I_ProyectoDao proyectoDao;

    @Override
    public List<Proyecto> findAll() {
        return proyectoDao.findAll();
    }

    @Override
    public Proyecto findById(Long id) {
        return proyectoDao.findById(id).orElse(null);
    }

    @Override
    public Proyecto save(Proyecto proyecto) {
        return proyectoDao.save(proyecto);
    }

    @Override
    public void delete(Long id) {
        proyectoDao.deleteById(id);
    }

    @Override
    public List<Proyecto> findByUsuario(Usuario usuario) {
        return proyectoDao.findByUsuario(usuario);
    }

    @Override
    public List<Proyecto> findByNombreProyectoAndUsuario(String nombreProyecto, Usuario usuario) {
        return proyectoDao.findByNombreProyectoAndUsuario(nombreProyecto, usuario);
    }


}