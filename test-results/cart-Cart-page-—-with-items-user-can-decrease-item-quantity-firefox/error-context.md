# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.ts >> Cart page — with items >> user can decrease item quantity
- Location: e2e\cart.spec.ts:50:7

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
            - generic [ref=e11]:
                - textbox "Search for products..." [ref=e12]
                - button "Search" [ref=e13] [cursor=pointer]
            - generic [ref=e14]:
                - link "Cart (0)" [ref=e15] [cursor=pointer]:
                    - /url: /cart
                    - generic [ref=e16]: Cart (0)
                - link "Sign in/Sign up" [ref=e17] [cursor=pointer]:
                    - /url: /login
                    - text: Sign in/Sign up
        - main [ref=e18]:
            - generic [ref=e19]:
                - generic [ref=e20]:
                    - generic [ref=e21]:
                        - generic [ref=e22]: Ecommerce website for ShowCase
                        - heading "I Work. You will Grow." [level=1] [ref=e23]
                        - paragraph [ref=e24]:
                            - text: I am dedicated for professionals works, including skilled developers, creative designers, customer-focused experts, technology enthusiasts, and operations specialists. Our unwavering mission is to collaboratively assist our clients and partners in bringing their innovative ideas to life.
                            - text: From web and mobile application development to cutting-edge design, we cater to your diverse needs. As technology enthusiasts and problem-solvers, we handle every aspect of your project, from conception to execution.
                        - link "Let's Go To Ecommerce" [ref=e26] [cursor=pointer]:
                            - /url: /productList
                    - img [ref=e29]
                - generic [ref=e346]:
                    - generic [ref=e348]:
                        - heading "Free Shipping" [level=4] [ref=e349]
                        - paragraph [ref=e350]: On Orders Over ₹2000
                    - generic [ref=e352]:
                        - heading "Money Returns" [level=4] [ref=e353]
                        - paragraph [ref=e354]: 30 Days Money Returns
                    - generic [ref=e356]:
                        - heading "24/7 Support" [level=4] [ref=e357]
                        - paragraph [ref=e358]: Dedicated Customer Support
                - generic [ref=e359]:
                    - heading "shop by category" [level=2] [ref=e360]
                    - generic [ref=e361]:
                        - generic [ref=e362]:
                            - img "category 1" [ref=e363]
                            - link "Electronics" [ref=e364] [cursor=pointer]:
                                - /url: /productList?category=Electronics
                        - generic [ref=e365]:
                            - img "category 1" [ref=e366]
                            - link "Laptops" [ref=e367] [cursor=pointer]:
                                - /url: /productList?category=Laptops
                        - generic [ref=e368]:
                            - img "category 1" [ref=e369]
                            - link "Cameras" [ref=e370] [cursor=pointer]:
                                - /url: /productList?category=Cameras
                        - generic [ref=e371]:
                            - img "category 1" [ref=e372]
                            - link "Accessories" [ref=e373] [cursor=pointer]:
                                - /url: /productList?category=Accessories
                        - generic [ref=e374]:
                            - img "category 1" [ref=e375]
                            - link "Headphones" [ref=e376] [cursor=pointer]:
                                - /url: /productList?category=Headphones
                        - generic [ref=e377]:
                            - img "category 1" [ref=e378]
                            - link "Sports" [ref=e379] [cursor=pointer]:
                                - /url: /productList?category=Sports
        - contentinfo [ref=e380]:
            - generic [ref=e381]:
                - img "logo_img" [ref=e383]
                - generic [ref=e384]:
                    - link "About Us" [ref=e385] [cursor=pointer]:
                        - /url: /about
                    - link "Products" [ref=e386] [cursor=pointer]:
                        - /url: /products
                    - link "Contact" [ref=e387] [cursor=pointer]:
                        - /url: /contact
            - separator [ref=e388]
            - paragraph [ref=e389]: © 2026 Ecom-Web. All rights reserved.
    - alert [ref=e390]
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
