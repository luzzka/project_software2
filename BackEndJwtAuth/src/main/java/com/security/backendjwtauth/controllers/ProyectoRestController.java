package com.security.backendjwtauth.controllers;

import com.security.backendjwtauth.entities.Proyecto;
import com.security.backendjwtauth.entities.Usuario;
import com.security.backendjwtauth.services.I_ProyectoService;
import com.security.backendjwtauth.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.slf4j.LoggerFactory.getLogger;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/proyectos")
public class ProyectoRestController {

    private final Logger log = getLogger(ProyectoRestController.class);
    private final I_ProyectoService proyectoService;

    private final UserService usuarioService;

    @GetMapping
    public List<Proyecto> getAllProyectos() {
        return proyectoService.findAll();
    }

    @GetMapping("/usuario/{login}")
    public ResponseEntity<?> getProyectosByUsuario(@PathVariable String login) {
        Map<String, Object> response = new HashMap<>();
        Usuario usuario = usuarioService.findByLogin_fullbody(login);
        List<Proyecto> proyectos = proyectoService.findByUsuario(usuario);

        if (proyectos.isEmpty()) {
            response.put("mensaje", "No se encontraron proyectos");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("mensaje", "Proyectos encontrados");
        response.put("proyectos", proyectos);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/proyecto/{id}")
    public ResponseEntity<?> getProyectoById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Proyecto proyecto = proyectoService.findById(id);
        if (proyecto == null) {
            response.put("mensaje", "El Proyecto con ID: " + id + " no existe en la base de datos");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.put("mensaje", "El proyecto fue encontrado");
        response.put("proyecto", proyecto);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/usuario/{login}/nombre/{nombreProyecto}")
    public List<Proyecto> getProyectosByNombreYUsuario(@PathVariable String login, @PathVariable String nombreProyecto) {
        Usuario usuario = usuarioService.findByLogin_fullbody(login);
        return proyectoService.findByNombreProyectoAndUsuario(nombreProyecto, usuario);
    }

    @PostMapping
    public Proyecto createProyecto(@RequestBody Proyecto proyecto) {
        return proyectoService.save(proyecto);
    }

    @PostMapping("/usuario/{login}")
    public ResponseEntity<?> createProyecto(@PathVariable String login, @RequestBody @Valid Proyecto proyecto, BindingResult result) {
        Usuario usuario = usuarioService.findByLogin_fullbody(login);
        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El campo '" + err.getField() + "' " + err.getDefaultMessage())
                    .toList();
            response.put("mensaje", "Errores varios");
            response.put("errors", errors);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        try {
            proyecto.setUsuario(usuario); // Asignar el usuario al proyecto antes de guardarlo
            Proyecto nuevoProyecto = proyectoService.save(proyecto);
            response.put("mensaje", "El proyecto fue creado con éxito");
            response.put("proyecto", nuevoProyecto);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (DataIntegrityViolationException e) {
            response.put("mensaje", "Ya existe un proyecto con el nombre " + proyecto.getNombreProyecto()+" y descripcion "+ proyecto.getDescripcionProyecto());
            response.put("error",e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);

        } catch (Exception e) {
            response.put("mensaje", "Error al crear en la base de datos");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/proyecto/{id}")
    public ResponseEntity<?> updateProyecto(@PathVariable Long id, @RequestBody @Valid Proyecto proyecto, BindingResult result) {
        Proyecto proyectoActual= proyectoService.findById(id);
        Proyecto proyectoUpdated;

        Map<String, Object> response = new HashMap<>();

        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "El campo '" + err.getField() + "' " + err.getDefaultMessage())
                    .toList();
            response.put("mensaje", "Errores varios");
            response.put("errors", errors);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (proyectoActual == null) {
            response.put("mensaje", "El Proyecto con ID: ".concat(id.toString().concat(" no existe en la base de datos, no se puede actualizar!")));
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        try {
            proyectoActual.setNombreProyecto(proyecto.getNombreProyecto());
            proyectoActual.setDescripcionProyecto(proyecto.getDescripcionProyecto());
            proyectoActual.setFechaInicioProyecto(proyecto.getFechaInicioProyecto());
            proyectoActual.setFechaFinProyecto(proyecto.getFechaFinProyecto());
            proyectoActual.setTipo(proyecto.getTipo());
            proyectoActual.setEstado(proyecto.getEstado());

            proyectoUpdated=proyectoService.save(proyectoActual);

            response.put("mensaje", "El proyecto fue actualizado con éxito");
            response.put("proyecto", proyectoUpdated);
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (DataIntegrityViolationException e) {
            response.put("mensaje", "Ya existe un proyecto con el nombre " + proyecto.getNombreProyecto()+" y descripcion "+ proyecto.getDescripcionProyecto());
            response.put("error",e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);

        } catch (Exception e) {
            response.put("mensaje", "Error al crear en la base de datos");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/proyecto/{id}")
    public ResponseEntity<?> deleteProyecto(@PathVariable Long id) {
        Proyecto proyectoActual = proyectoService.findById(id);
        Map<String, Object> response = new HashMap<>();

        if (proyectoActual == null) {
            response.put("mensaje", "El Proyecto con ID: " + id + " no existe en la base de datos");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        try {
            proyectoService.delete(id);
            response.put("mensaje", "El proyecto fue eliminado con éxito");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("mensaje", "Error al eliminar el proyecto");
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
