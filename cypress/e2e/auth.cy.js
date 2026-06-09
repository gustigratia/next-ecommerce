describe('Authentication pages', () => {
  it('menampilkan form login', () => {
    cy.visit('/login');

    cy.contains(/Welcome To Ecommerce Site/i).should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains(/^Sign in$/i).should('be.visible');
    cy.contains(/Sign in with Google/i).should('be.visible');
    cy.contains(/Sign in with Twitter/i).should('be.visible');
  });

  it('bisa berpindah dari login ke signup', () => {
    cy.visit('/login');
    cy.get('[data-cy="signup-link"]').click();
    cy.location('pathname').should('eq', '/signup');
    cy.contains(/Register here to Join Us/i).should('be.visible');
  });

  it('menampilkan validasi password lemah pada signup', () => {
    cy.visit('/signup');

    cy.get('input[type="password"]').first().type('abc');
    cy.contains(/Password must contain at least 8 characters/i).should('be.visible');
  });
});
