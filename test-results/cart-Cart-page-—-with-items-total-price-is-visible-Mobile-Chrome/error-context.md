# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart page — with items >> total price is visible
- Location: e2e\cart.spec.ts:76:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="product-card"]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - generic [ref=e6]:
            - link "logo_img" [ref=e7] [cursor=pointer]:
                - /url: /
                - img "logo_img" [ref=e9]
            - generic [ref=e10]:
                - link [ref=e11] [cursor=pointer]:
                    - /url: /cart
                - link [ref=e12] [cursor=pointer]:
                    - /url: /login
        - main [ref=e13]:
            - generic [ref=e14]:
                - generic [ref=e15]:
                    - generic [ref=e16]:
                        - generic [ref=e17]: Ecommerce website for ShowCase
                        - heading "I Work. You will Grow." [level=1] [ref=e18]
                        - paragraph [ref=e19]:
                            - text: I am dedicated for professionals works, including skilled developers, creative designers, customer-focused experts, technology enthusiasts, and operations specialists. Our unwavering mission is to collaboratively assist our clients and partners in bringing their innovative ideas to life.
                            - text: From web and mobile application development to cutting-edge design, we cater to your diverse needs. As technology enthusiasts and problem-solvers, we handle every aspect of your project, from conception to execution.
                        - link "Let's Go To Ecommerce" [ref=e21] [cursor=pointer]:
                            - /url: /productList
                    - img [ref=e24]
                - generic [ref=e374]:
                    - generic [ref=e376]:
                        - heading "Free Shipping" [level=4] [ref=e377]
                        - paragraph [ref=e378]: On Orders Over ₹2000
                    - generic [ref=e380]:
                        - heading "Money Returns" [level=4] [ref=e381]
                        - paragraph [ref=e382]: 30 Days Money Returns
                    - generic [ref=e384]:
                        - heading "24/7 Support" [level=4] [ref=e385]
                        - paragraph [ref=e386]: Dedicated Customer Support
                - generic [ref=e387]:
                    - heading "shop by category" [level=2] [ref=e388]
                    - generic [ref=e389]:
                        - generic [ref=e390]:
                            - img "category 1" [ref=e391]
                            - link "Electronics" [ref=e392] [cursor=pointer]:
                                - /url: /productList?category=Electronics
                        - generic [ref=e393]:
                            - img "category 1" [ref=e394]
                            - link "Laptops" [ref=e395] [cursor=pointer]:
                                - /url: /productList?category=Laptops
                        - generic [ref=e396]:
                            - img "category 1" [ref=e397]
                            - link "Cameras" [ref=e398] [cursor=pointer]:
                                - /url: /productList?category=Cameras
                        - generic [ref=e399]:
                            - img "category 1" [ref=e400]
                            - link "Accessories" [ref=e401] [cursor=pointer]:
                                - /url: /productList?category=Accessories
                        - generic [ref=e402]:
                            - img "category 1" [ref=e403]
                            - link "Headphones" [ref=e404] [cursor=pointer]:
                                - /url: /productList?category=Headphones
                        - generic [ref=e405]:
                            - img "category 1" [ref=e406]
                            - link "Sports" [ref=e407] [cursor=pointer]:
                                - /url: /productList?category=Sports
        - contentinfo [ref=e408]:
            - generic [ref=e409]:
                - img "logo_img" [ref=e411]
                - generic [ref=e412]:
                    - link "About Us" [ref=e413] [cursor=pointer]:
                        - /url: /about
                    - link "Products" [ref=e414] [cursor=pointer]:
                        - /url: /products
                    - link "Contact" [ref=e415] [cursor=pointer]:
                        - /url: /contact
            - separator [ref=e416]
            - paragraph [ref=e417]: © 2026 Ecom-Web. All rights reserved.
    - alert [ref=e418]
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
> 13 |   await page.locator('[data-testid="product-card"]').first().click();
     |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  90 |       await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  91 |       await expect(page.getByRole('link', { name: /shop now|continue shopping/i })).toBeVisible();
  92 |     }
  93 |   });
  94 | });
  95 |
```
