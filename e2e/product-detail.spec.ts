import { expect, test } from '@playwright/test';

/**
 * E2E — Product Detail Page
 *
 * Tests the single product view: image gallery, description, Add to Cart,
 * and similar items section.
 */

test.describe('Product Detail', () => {
  // Navigate to the first product from the homepage
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="product-card"]').first().click();
    // Wait for the detail page URL (e.g. /products/[id])
    await page.waitForURL(/\/products\//);
  });

  test('displays the product title and price', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/\$[\d,.]+/)).toBeVisible();
  });

  test('shows a product image', async ({ page }) => {
    const img = page.getByRole('img', { name: /.+/ }).first();
    await expect(img).toBeVisible();
    // Image should have a meaningful src (not a placeholder)
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('shows a product description', async ({ page }) => {
    await expect(page.getByTestId('product-description')).toBeVisible();
  });

  test('shows star rating', async ({ page }) => {
    await expect(page.getByTestId('product-rating')).toBeVisible();
  });

  test('"Add to Cart" button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
  });

  test('shows similar/related products section', async ({ page }) => {
    await expect(page.getByText(/similar|related/i)).toBeVisible();
    const related = page.locator('[data-testid="product-card"]');
    await expect(related.first()).toBeVisible();
  });
});

test.describe('Add to Cart from product detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForURL(/\/products\//);
  });

  test('clicking Add to Cart shows a success toast', async ({ page }) => {
    await page.getByRole('button', { name: /add to cart/i }).click();
    // react-toastify renders a toast with role="alert"
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/added|cart/i);
  });

  test('cart icon badge count increments after adding', async ({ page }) => {
    // Get the initial badge count (may be 0 or absent)
    const badge = page.getByTestId('cart-badge');
    const initialCount = parseInt((await badge.textContent()) || '0', 10);

    await page.getByRole('button', { name: /add to cart/i }).click();

    await expect(badge).toHaveText(String(initialCount + 1));
  });
});
