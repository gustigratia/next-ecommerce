describe('Product list page', () => {
  beforeEach(() => {
    cy.mockProductListApi();
    cy.visit('/productList');
    cy.wait('@getProductsPage1');
    cy.contains('Samsung Smart TV 55 Inch').should('be.visible');
  });

  it('menampilkan daftar produk dari API', () => {
    cy.contains('Samsung Smart TV 55 Inch').should('be.visible');
    cy.contains('MacBook Air M2').should('be.visible');
    cy.contains('Sony Wireless Headphones').should('be.visible');
    cy.contains('Canon Mirrorless Camera').should('be.visible');
    cy.contains(/Free Shipping/i).should('be.visible');
  });

  it('mengirim keyword search ke halaman productList', () => {
    cy.get('nav form input, form input[required]').first().clear().type('laptop{enter}');

    cy.location('pathname').should('include', '/productList');
    cy.location('search').should('include', 'keyword=laptop');
  });

  it('bisa berpindah halaman pagination', () => {
    cy.contains('Samsung Smart TV 55 Inch').should('be.visible');
    cy.contains('Travel Backpack').should('not.exist');

    cy.get('.pagination').contains(/Next/i).click({ force: true });

    cy.wait('@getProductsPage2').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body.products[0].name).to.equal('Travel Backpack');
    });

    cy.get('main', { timeout: 10000 }).should('contain.text', 'Travel Backpack');
  });

  it('menampilkan alert login ketika guest menekan Add to Cart', () => {
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Please login first');
    });

    cy.contains('Samsung Smart TV 55 Inch')
      .parents('div')
      .contains(/Add to Cart/i)
      .click();
  });
});
