describe('Login and Manage Tasks Test', () => {
  it('should log in and manage tasks for PR1 successfully', () => {
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
    cy.contains('Te damos la bienvenida').should('be.visible');

    // Hacer clic en el proyecto "PR1" para mostrar las opciones
    cy.contains('PR1').click();

    // Hacer clic en la opción "Administrar Tareas" del dropdown
    cy.contains('PR1').parent().contains('Administrar Tareas').click();

    // Verificar que la página de administración de tareas se abre
    cy.url().should('include', '/AuthContent;redirected=true');
    cy.contains('Te damos la bienvenida').should('be.visible');

    // Ver los detalles de la segunda tarea
    cy.get('tr').eq(2).contains('Ver Detalles').click();

    // Verificar que los detalles de la tarea se muestran
    cy.contains('Diseño de Arquitectura').should('be.visible'); // Verifica el título de la tarea
    cy.contains('Descripción: Crear el diseño de la arquitectura del sistema.').should('be.visible'); // Verifica la descripción de la tarea
    cy.contains('Fecha de Creación: 2024-05-11').should('be.visible'); // Verifica la fecha de creación
    cy.contains('Fecha de Finalización: 2024-05-20').should('be.visible'); // Verifica la fecha de finalización


  });
});
