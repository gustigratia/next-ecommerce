describe('Cart Page', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit('/cart', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
  });

  it('menampilkan cart kosong untuk guest user', () => {
    cy.contains('0 Item(s) in Cart').should('be.visible');
    cy.contains('Your cart is empty').should('be.visible');
    cy.contains('Looks like you have not added any product to your cart yet.').should('be.visible');
    cy.contains('Back to shop').should('be.visible');

    cy.contains('Continue').should('not.exist');
    cy.contains('Total price').should('not.exist');
  });
});
