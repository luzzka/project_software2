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

    // Interactuar con la primera confirmaciónDiseño de Arquitectura
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

    // Regresar a la vista de proyectos
    cy.contains('Regresar a Proyectos').click();

    // Verificar que la navegación de regreso a la vista de proyectos ha ocurrido
    cy.url().should('include', '/AuthContent;redirected=true');
    cy.contains('Te damos la bienvenida').should('be.visible');
  });
});
