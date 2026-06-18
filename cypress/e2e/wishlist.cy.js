describe('Wishlist page', () => {
  it('menampilkan wishlist kosong dan bisa menuju product list', () => {
    cy.visit('/wishlist');

    cy.contains(/Wishlist masih kosong/i).should('be.visible');
    cy.contains(/Jelajahi Produk/i)
      .should('be.visible')
      .click();

    cy.location('pathname').should('include', '/productList');
    cy.contains(/Pengiriman Gratis/i).should('be.visible');
  });
});
