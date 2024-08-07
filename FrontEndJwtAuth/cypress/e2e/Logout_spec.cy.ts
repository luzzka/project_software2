describe('Login and Manage Tasks Test', () => {
  it('should log in, manage tasks for PR1, and navigate back to projects, then log out', () => {
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

    // Cerrar sesión
    cy.contains('Logout').click();

    // Verificar que la sesión se ha cerrado correctamente
    cy.url().should('include', '/login'); // Ajusta esta URL según la redirección real después del cierre de sesión
    cy.contains('Log in').should('be.visible'); // Verifica que el botón de inicio de sesión es visible de nuevo
  });
});
