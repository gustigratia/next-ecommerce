Cypress.Commands.add('mockProductListApi', () => {
  cy.fixture('products').then((products) => {
    cy.intercept('GET', '/api/product*', (req) => {
      const url = new URL(req.url);
      const page = url.searchParams.get('page') || '1';

      req.reply({
        statusCode: 200,
        body: page === '2' ? products.page2 : products.page1,
      });
    }).as('getProducts');
  });
});
