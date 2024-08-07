describe('Login Test', () => {
  it('should log in successfully', () => {
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
    cy.url().should('include', '/AuthContent'); // Ajusta la URL según tu aplicación
    cy.contains('Te damos la bienvenida').should('be.visible');
  });
});
