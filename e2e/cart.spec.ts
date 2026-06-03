import { Page, expect, test } from '@playwright/test';

/**
 * E2E — Cart Page
 *
 * Tests the full cart experience: viewing items, changing quantities,
 * removing items, and the empty-cart state.
 */

/** Helper: add the first product on the homepage to the cart. */
async function addFirstProductToCart(page: Page) {
  await page.goto('/');
  await page.locator('[data-testid="product-card"]').first().click();
  await page.waitForURL(/\/products\//);
  await page.getByRole('button', { name: /add to cart/i }).click();
  // Wait for toast to confirm it was added
  await page.getByRole('alert').waitFor();
}

test.describe('Cart page — with items', () => {
  test.beforeEach(async ({ page }) => {
    await addFirstProductToCart(page);
    // Navigate to cart
    await page.getByRole('link', { name: /cart/i }).click();
    await page.waitForURL(/\/cart/);
  });

  test('shows the added product in the cart', async ({ page }) => {
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
  });

  test('displays the product name and price', async ({ page }) => {
    const item = page.locator('[data-testid="cart-item"]').first();
    await expect(item.getByRole('heading')).toBeVisible();
    await expect(item.getByText(/\$[\d,.]+/)).toBeVisible();
  });

  test('user can increase item quantity', async ({ page }) => {
    const increaseBtn = page
      .locator('[data-testid="cart-item"]')
      .first()
      .getByRole('button', { name: /\+|increase/i });

    await increaseBtn.click();

    const qty = page.locator('[data-testid="cart-item"]').first().getByRole('spinbutton');
    await expect(qty).toHaveValue('2');
  });

  test('user can decrease item quantity', async ({ page }) => {
    // First increase to 2, then decrease back to 1
    const item = page.locator('[data-testid="cart-item"]').first();
    await item.getByRole('button', { name: /\+|increase/i }).click();
    await item.getByRole('button', { name: /−|decrease/i }).click();

    await expect(item.getByRole('spinbutton')).toHaveValue('1');
  });

  test('removing an item updates the cart', async ({ page }) => {
    const initialCount = await page.locator('[data-testid="cart-item"]').count();

    await page
      .locator('[data-testid="cart-item"]')
      .first()
      .getByRole('button', { name: /remove/i })
      .click();

    if (initialCount === 1) {
      // Should show empty-cart message
      await expect(page.getByText(/your cart is empty/i)).toBeVisible();
    } else {
      await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(initialCount - 1);
    }
  });

  test('total price is visible', async ({ page }) => {
    await expect(page.getByTestId('cart-total')).toBeVisible();
    await expect(page.getByTestId('cart-total')).toContainText(/\$/);
  });
});

test.describe('Cart page — empty state', () => {
  test('shows empty-cart message when no items', async ({ page }) => {
    await page.goto('/cart');
    // If the cart is empty (fresh session), we expect the empty state
    const items = page.locator('[data-testid="cart-item"]');
    const count = await items.count();

    if (count === 0) {
      await expect(page.getByText(/your cart is empty/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /shop now|continue shopping/i })).toBeVisible();
    }
  });
});
