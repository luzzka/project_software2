describe('Login and Create Project Test', () => {
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

    // Verificar que el proyecto ha sido creado y aparece en la lista de proyectos
    // Ajusta según el comportamiento real de tu aplicación después de crear un proyecto
    cy.contains('Nuevo Proyecto').should('be.visible');
    cy.contains('Descripción del nuevo proyecto').should('be.visible');
  });
});
