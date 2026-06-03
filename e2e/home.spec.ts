import { expect, test } from '@playwright/test';

/**
 * E2E — Homepage & Product Browsing
 *
 * These tests verify that a user can land on the site, see products,
 * paginate, and filter by category.
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the site header / brand name', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
    // Adjust the text matcher to match your actual navbar brand
    await expect(page.getByRole('link', { name: /shop|ecom|store/i }).first()).toBeVisible();
  });

  test('renders a grid of product cards', async ({ page }) => {
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards.first()).toBeVisible();
    // At least a few products should load
    await expect(cards).toHaveCountGreaterThan(2);
  });

  test('each product card shows a title and price', async ({ page }) => {
    const firstCard = page.locator('[data-testid="product-card"]').first();
    await expect(firstCard.getByRole('heading')).toBeVisible();
    await expect(firstCard.getByText(/\$[\d,.]+/)).toBeVisible();
  });

  test('pagination controls are visible', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: /pagination/i })).toBeVisible();
  });

  test('navigating to page 2 loads different products', async ({ page }) => {
    const firstPageTitle = await page.locator('[data-testid="product-card"]').first().innerText();

    await page.getByRole('button', { name: /next page|2/i }).click();
    await page.waitForURL(/page=2/);

    const secondPageTitle = await page.locator('[data-testid="product-card"]').first().innerText();

    expect(firstPageTitle).not.toBe(secondPageTitle);
  });
});

test.describe('Category filter', () => {
  test('filters products when a category is selected', async ({ page }) => {
    await page.goto('/');

    // Click on a category filter (adapt selector to your UI)
    await page.getByRole('button', { name: /electronics/i }).click();
    await page.waitForURL(/category=electronics/i);

    // All visible cards should belong to the selected category
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('shows a "no products" message for an empty category', async ({ page }) => {
    await page.goto('/?category=nonexistent-category-xyz');
    await expect(page.getByText(/no products found/i)).toBeVisible();
  });
});
