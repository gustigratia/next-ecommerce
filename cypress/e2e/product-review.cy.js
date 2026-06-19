describe('Product Reviews E2E', () => {
  it('creates a review via API and verifies it appears on product page', () => {
    // Fetch available products and pick the first one
    cy.request('GET', '/api/product').then((res) => {
      expect(res.status).to.eq(200);
      const products = res.body.products || [];
      expect(products.length).to.be.greaterThan(0);
      const product = products[0];
      const id = product._id;

      const comment = `Cypress E2E review ${Date.now()}`;

      // Create a review using the API
      cy.request('POST', `/api/product/${id}`, {
        name: 'Cypress E2E',
        rating: 5,
        comment,
      }).then((postRes) => {
        expect([200, 201]).to.include(postRes.status);

        // Visit the product page and assert the new review is visible
        cy.visit(`/productList/${id}`);

        cy.contains('Reviews').should('be.visible');
        cy.contains(comment).should('be.visible');
      });
    });
  });
});
