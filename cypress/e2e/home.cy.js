describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('menampilkan landing page dan kategori toko', () => {
    cy.contains(/Promo Kemerdekaan/i).should('be.visible');
    cy.contains(/Merdeka Berbelanja, Merdeka Hemat/i).should('be.visible');
    cy.contains(/Kategori Pilihan/i).should('be.visible');

    ['Electronics', 'Laptops', 'Cameras', 'Accessories', 'Headphones', 'Sports'].forEach(
      (category) => {
        cy.contains(category).should('be.visible');
      }
    );
  });

  it('bisa membuka halaman login dari navbar', () => {
    cy.get('a[href="/login"]').first().click();

    cy.location('pathname').should('include', '/login');
    cy.contains(/Selamat Datang di Ecom-Web/i).should('be.visible');
    cy.contains(/Masuk Sekarang/i).should('be.visible');
  });
});
