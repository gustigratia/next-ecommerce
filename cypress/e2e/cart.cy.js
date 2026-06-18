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
    cy.contains('Keranjang Belanja Kosong').should('be.visible');
    cy.contains('Sepertinya Anda belum menambahkan produk ke keranjang').should('be.visible');
    cy.contains('🛍️ Kembali Berbelanja 🛍️').should('be.visible');

    cy.contains('✅ Lanjutkan ke Checkout').should('not.exist');
    cy.contains('Total Harga').should('not.exist');
  });

  it('bisa kembali ke homepage dari halaman cart kosong', () => {
    cy.contains('🛍️ Kembali Berbelanja 🛍️').click();

    cy.location('pathname').should('eq', '/');
    cy.contains(/Promo Kemerdekaan/i).should('be.visible');
    cy.contains(/Mulai Berbelanja/i).should('be.visible');
  });
});
