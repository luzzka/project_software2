describe('Login and Delete Project Test', () => {
  it('should log in and create a project successfully', () => {
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

    // Eliminar el proyecto creado
    // Hacer clic en el proyecto "Nuevo Proyecto" para mostrar las opciones
    cy.contains('Nuevo Proyecto').click();

    // Hacer clic en la opción "Eliminar" del dropdown
    cy.contains('Nuevo Proyecto').parent().contains('Eliminar').click();

    // Interactuar con la primera confirmación
    cy.contains('¿Desea borrar el proyecto Nuevo Proyecto?').should('be.visible');
    cy.contains('Sí').click();

    // Interactuar con la segunda confirmación
    cy.contains('Los cambios serán irreversibles y no se podrá recuperar el proyecto').should('be.visible');
    cy.contains('Confirmar').click();

    // Confirmar que el proyecto ha sido eliminado
    cy.contains('Nuevo Proyecto').should('not.exist');
  });
});
