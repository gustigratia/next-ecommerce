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
    cy.contains('Pengiriman Gratis').should('be.visible');
  });

  it('Mengirim keyword search ke halaman productList', () => {
    cy.get('form input[placeholder="Search for products..."]').first().as('searchInput');

    cy.get('@searchInput').clear().type('laptop{enter}');

    cy.location('pathname').should('include', '/productList');
    cy.location('search').should('include', 'keyword=laptop');

    cy.get('form input[placeholder="Search for products..."]')
      .first()
      .should('have.value', 'laptop');
  });

  it('bisa berpindah halaman pagination', () => {
    cy.contains('Samsung Smart TV 55 Inch').should('be.visible');
    cy.contains('Travel Backpack').should('not.exist');

    cy.get('[data-cy="pagination"]').should('be.visible');
    cy.get('[data-cy="pagination-page-1"]').should('be.visible');
    cy.get('[data-cy="pagination-page-2"]').should('be.visible');

    cy.get('[data-cy="pagination-next"]').should('be.visible').and('not.be.disabled').click();

    cy.wait('@getProductsPage2').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.request.url).to.include('page=2');
      expect(interception.response.body.currentPage).to.equal(2);
      expect(interception.response.body.products[0].name).to.equal('Travel Backpack');
    });

    cy.get('main', { timeout: 10000 }).should('contain.text', 'Travel Backpack');
    cy.contains('Samsung Smart TV 55 Inch').should('not.exist');

    cy.get('[data-cy="pagination-page-2"]').should('have.class', 'font-bold');
  });

  it('menampilkan toast login ketika guest menekan Tambah ke Keranjang', () => {
    cy.contains('Samsung Smart TV 55 Inch')
      .parents('div')
      .contains(/Tambah ke Keranjang/i)
      .click();

    cy.get('.Toastify__toast-body', { timeout: 5000 }).should(
      'contain.text',
      'Please sign in to add items to your cart.'
    );
  });
});
