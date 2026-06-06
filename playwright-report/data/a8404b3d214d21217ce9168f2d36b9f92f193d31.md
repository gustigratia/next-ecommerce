# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart page — empty state >> shows empty-cart message when no items
- Location: e2e\cart.spec.ts:83:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/your cart is empty/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/your cart is empty/i)

```

```yaml
- link "logo_img":
    - /url: /
    - img "logo_img"
- link:
    - /url: /cart
- link:
    - /url: /login
- main:
    - heading "0 Item(s) in Cart" [level=2]
- contentinfo:
    - img "logo_img"
    - link "About Us":
        - /url: /about
    - link "Products":
        - /url: /products
    - link "Contact":
        - /url: /contact
    - separator
    - paragraph: © 2026 Ecom-Web. All rights reserved.
- alert
```

# Test source

```ts
  1  | import { Page, expect, test } from '@playwright/test';
  2  |
  3  | /**
  4  |  * E2E — Cart Page
  5  |  *
  6  |  * Tests the full cart experience: viewing items, changing quantities,
  7  |  * removing items, and the empty-cart state.
  8  |  */
  9  |
  10 | /** Helper: add the first product on the homepage to the cart. */
  11 | async function addFirstProductToCart(page: Page) {
  12 |   await page.goto('/');
  13 |   await page.locator('[data-testid="product-card"]').first().click();
  14 |   await page.waitForURL(/\/products\//);
  15 |   await page.getByRole('button', { name: /add to cart/i }).click();
  16 |   // Wait for toast to confirm it was added
  17 |   await page.getByRole('alert').waitFor();
  18 | }
  19 |
  20 | test.describe('Cart page — with items', () => {
  21 |   test.beforeEach(async ({ page }) => {
  22 |     await addFirstProductToCart(page);
  23 |     // Navigate to cart
  24 |     await page.getByRole('link', { name: /cart/i }).click();
  25 |     await page.waitForURL(/\/cart/);
  26 |   });
  27 |
  28 |   test('shows the added product in the cart', async ({ page }) => {
  29 |     await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
  30 |   });
  31 |
  32 |   test('displays the product name and price', async ({ page }) => {
  33 |     const item = page.locator('[data-testid="cart-item"]').first();
  34 |     await expect(item.getByRole('heading')).toBeVisible();
  35 |     await expect(item.getByText(/\$[\d,.]+/)).toBeVisible();
  36 |   });
  37 |
  38 |   test('user can increase item quantity', async ({ page }) => {
  39 |     const increaseBtn = page
  40 |       .locator('[data-testid="cart-item"]')
  41 |       .first()
  42 |       .getByRole('button', { name: /\+|increase/i });
  43 |
  44 |     await increaseBtn.click();
  45 |
  46 |     const qty = page.locator('[data-testid="cart-item"]').first().getByRole('spinbutton');
  47 |     await expect(qty).toHaveValue('2');
  48 |   });
  49 |
  50 |   test('user can decrease item quantity', async ({ page }) => {
  51 |     // First increase to 2, then decrease back to 1
  52 |     const item = page.locator('[data-testid="cart-item"]').first();
  53 |     await item.getByRole('button', { name: /\+|increase/i }).click();
  54 |     await item.getByRole('button', { name: /−|decrease/i }).click();
  55 |
  56 |     await expect(item.getByRole('spinbutton')).toHaveValue('1');
  57 |   });
  58 |
  59 |   test('removing an item updates the cart', async ({ page }) => {
  60 |     const initialCount = await page.locator('[data-testid="cart-item"]').count();
  61 |
  62 |     await page
  63 |       .locator('[data-testid="cart-item"]')
  64 |       .first()
  65 |       .getByRole('button', { name: /remove/i })
  66 |       .click();
  67 |
  68 |     if (initialCount === 1) {
  69 |       // Should show empty-cart message
  70 |       await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  71 |     } else {
  72 |       await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(initialCount - 1);
  73 |     }
  74 |   });
  75 |
  76 |   test('total price is visible', async ({ page }) => {
  77 |     await expect(page.getByTestId('cart-total')).toBeVisible();
  78 |     await expect(page.getByTestId('cart-total')).toContainText(/\$/);
  79 |   });
  80 | });
  81 |
  82 | test.describe('Cart page — empty state', () => {
  83 |   test('shows empty-cart message when no items', async ({ page }) => {
  84 |     await page.goto('/cart');
  85 |     // If the cart is empty (fresh session), we expect the empty state
  86 |     const items = page.locator('[data-testid="cart-item"]');
  87 |     const count = await items.count();
  88 |
  89 |     if (count === 0) {
> 90 |       await expect(page.getByText(/your cart is empty/i)).toBeVisible();
     |                                                           ^ Error: expect(locator).toBeVisible() failed
  91 |       await expect(page.getByRole('link', { name: /shop now|continue shopping/i })).toBeVisible();
  92 |     }
  93 |   });
  94 | });
  95 |
```
