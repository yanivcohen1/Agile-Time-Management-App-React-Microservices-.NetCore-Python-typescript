describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully as a regular User', () => {
    cy.contains('Sign in');
    
    // Fill in credentials for regular user
    cy.get('input[name="email"]').clear().type('user@todo.dev');
    cy.get('input[name="password"]').clear().type('ChangeMe123!');
    
    cy.get('button[type="submit"]').click();
    
    // Verify redirection and user context
    cy.url().should('not.include', '/login');
    cy.contains('Main Status Board');
    cy.contains('Demo User (user)'); // Verify user name/role in the app bar
  });

  it('should login successfully as an Admin', () => {
    cy.contains('Sign in');
    
    // Fill in credentials for admin
    cy.get('input[name="email"]').clear().type('admin@todo.dev');
    cy.get('input[name="password"]').clear().type('ChangeMe123!');
    
    cy.get('button[type="submit"]').click();
    
    // Verify redirection and user context
    cy.url().should('not.include', '/login');
    cy.contains('Main Status Board');
    cy.contains('Demo Admin (admin)'); // Verify user name/role in the app bar
  });

  it('should show error on invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@todo.dev');
    cy.get('input[name="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Login failed').should('be.visible');
    cy.url().should('include', '/login');
  });
});
