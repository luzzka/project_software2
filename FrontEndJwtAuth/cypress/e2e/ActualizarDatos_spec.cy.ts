describe('Login and Create/Update Project Test', () => {
  it('should log in, create a project and update it successfully', () => {
    // Visitar la página de login
    cy.visit('http://localhost:4200/login');

    // Ingresar el nombre de usuario
    cy.get('input[name="login"]').type('user');

    // Ingresar la contraseña
    cy.get('input[name="password"]').type('123456');

    // Hacer clic en el botón de login
    cy.get('button[type="submit"]').click();

    // Interactuar con la primera confirmación
    cy.contains('El usuario fue loggeado con Éxito').should('be.visible');
    cy.contains('OK').click();

    // Verificar que se ha iniciado sesión correctamente
    cy.url().should('include', '/AuthContent'); // Ajusta esta URL según la redirección real
    //cy.contains('Te damos la bienvenida').should('be.visible'); // Ajusta este texto según tu aplicación

    // Hacer clic en el botón "Crear Proyecto"
    cy.contains('Crear Proyecto').click();

    // Verificar que el modal se abre
    cy.get('.modal').should('be.visible');

    // Llenar el formulario de creación de proyectos
    cy.get('input[name="nombre"]').type('Nuevo Proyecto');
    cy.get('input[name="descripcion"]').type('Descripción del nuevo proyecto');
    cy.get('input[name="f_creacion"]').type('2023-01-01');
    cy.get('input[name="f_fin"]').type('2023-12-31');
    cy.get('select[name="tipo"]').select('DESARROLLO');
    cy.get('select[name="estado"]').select('PENDIENTE');

    // Enviar el formulario
    cy.get('button[type="submit"]').contains('Crear Proyecto').click();

    // Interactuar con la primera confirmación
    cy.contains('El proyecto ha sido creado con éxito').should('be.visible');
    cy.contains('OK').click();

    // Verificar que el proyecto ha sido creado y aparece en la lista de proyectos
    cy.contains('Nuevo Proyecto').should('be.visible');
    cy.contains('Descripción del nuevo proyecto').should('be.visible');

    // Actualizar el proyecto creado
    // Hacer clic en el proyecto "Nuevo Proyecto" para mostrar las opciones
    cy.contains('Nuevo Proyecto').click();

    // Hacer clic en la opción "Actualizar Datos" del dropdown
    cy.contains('Nuevo Proyecto').parent().contains('Actualizar Datos').click();

    // Verificar que el modal se abre para actualizar datos
    cy.get('.modal').should('be.visible');

    // Llenar el formulario de actualización de proyectos con nuevos datos
    cy.get('input[name="nombre"]').clear().type('Proyecto Actualizado');
    cy.get('input[name="descripcion"]').clear().type('Descripción del proyecto actualizado');
    cy.get('input[name="f_creacion"]').clear().type('2023-02-01');
    cy.get('input[name="f_fin"]').clear().type('2023-11-30');
    cy.get('select[name="tipo"]').select('PRUEBAS');
    cy.get('select[name="estado"]').select('EN_PROGRESO');

    // Enviar el formulario de actualización
    cy.get('button[type="submit"]').contains('Guardar Cambios').click();

    // Verificar que el proyecto ha sido actualizado y aparece en la lista de proyectos
    cy.contains('Proyecto Actualizado').should('be.visible');
    cy.contains('Descripción del proyecto actualizado').should('be.visible');
  });
});
