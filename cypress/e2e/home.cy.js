describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('menampilkan landing page dan kategori toko', () => {
    cy.contains(/Ecommerce website for ShowCase/i).should('be.visible');
    cy.contains(/I Work\. You will Grow\./i).should('be.visible');
    cy.contains(/shop by category/i).should('be.visible');

    ['Electronics', 'Laptops', 'Cameras', 'Accessories', 'Headphones', 'Sports'].forEach(
      (category) => {
        cy.contains(category).should('be.visible');
      }
    );
  });

  it('bisa membuka halaman login dari navbar', () => {
    cy.contains(/Sign in\/Sign up/i).click();

    cy.location('pathname').should('include', '/login');
    cy.contains(/Welcome To Ecommerce Site/i).should('be.visible');
    cy.contains(/Sign in/i).should('be.visible');
  });
});
