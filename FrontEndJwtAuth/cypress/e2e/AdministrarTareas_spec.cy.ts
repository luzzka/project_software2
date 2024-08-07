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
    cy.contains('Te damos la bienvenida').should('be.visible'); // Ajusta este texto según tu aplicación

    // Hacer clic en el proyecto para mostrar las opciones
    cy.contains('PR1').click();

    // Hacer clic en la opción "Administrar Tareas" del dropdown
    cy.contains('PR1').parent().contains('Administrar Tareas').click();

    // Verificar que la página o modal de administración de tareas se abre
    cy.url().should('include', '/AuthContent;redirected=true');
    cy.contains('Te damos la bienvenida').should('be.visible');

  });
});
