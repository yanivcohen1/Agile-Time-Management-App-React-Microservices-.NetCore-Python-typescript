describe('Todo Operations', () => {
  const timestamp = new Date().getTime();
  const userTodoTitle = `User Todo ${timestamp}`;
  const adminTodoTitle = `Admin Todo ${timestamp}`;

  beforeEach(() => {
    cy.viewport(1280, 720); // Ensure desktop view
  });

  context('As a Regular User', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
      cy.visit('/login');
      cy.get('input[name="email"]').clear().type('user@todo.dev');
      cy.get('input[name="password"]').clear().type('ChangeMe123!');
      cy.get('button[type="submit"]').click();
      cy.contains('Main Status Board');
      cy.wait(1000);
    });

    it('should be able to create a new todo', () => {
      cy.get('body').type('{esc}');
      cy.wait(500);
      
      cy.get('.MuiDrawer-root').contains('Create New').click({ force: true });
      cy.contains('Create New Todo').should('be.visible');

      cy.get('input[name="title"]').type(userTodoTitle);
      cy.get('textarea[name="description"]').type('This is a test todo created by user');
      
      cy.contains('button', 'Create').click();

      cy.contains('Create New Todo').should('not.exist');

      // Navigate to Track Status to verify
      cy.get('.MuiDrawer-root').contains('Track status').click();
      cy.url().should('include', '/track');

      // Search for the todo
      // MUI TextField label "Search"
      cy.get('label').contains('Search').parent().find('input').type(userTodoTitle);
      
      // Verify it appears in the table
      cy.contains(userTodoTitle).should('be.visible');
    });
  });

  context('As an Admin', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
      cy.visit('/login');
      cy.get('input[name="email"]').clear().type('admin@todo.dev');
      cy.get('input[name="password"]').clear().type('ChangeMe123!');
      cy.get('button[type="submit"]').click();
      cy.contains('Main Status Board');
      cy.wait(1000);
    });

    it('should be able to create a new todo', () => {
      cy.get('body').type('{esc}');
      cy.wait(500);
      
      cy.get('.MuiDrawer-root').contains('Create New').click({ force: true });
      cy.contains('Create New Todo').should('be.visible');

      cy.get('input[name="title"]').type(adminTodoTitle);
      cy.get('textarea[name="description"]').type('This is a test todo created by admin');

      cy.contains('button', 'Create').click();

      cy.contains('Create New Todo').should('not.exist');

      // Navigate to Track Status
      cy.get('.MuiDrawer-root').contains('Track status').click();
      cy.url().should('include', '/track');

      // Search
      cy.get('label').contains('Search').parent().find('input').type(adminTodoTitle);

      // Verify
      cy.contains(adminTodoTitle).should('be.visible');
    });
  });
});
