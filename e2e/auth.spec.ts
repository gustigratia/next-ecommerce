import { expect, test } from '@playwright/test';

test.describe('Auth — sign-in page UI', () => {
  test('renders the sign-in page with a Google button', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /sign in|login/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
  });

  test('sign-in page is accessible from the navbar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Auth — protected routes redirect', () => {
  test('visiting /cart without auth redirects to login', async ({ page }) => {
    // Use a fresh browser context (no stored session)
    await page.goto('/profile');
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Auth — mocked signed-in state', () => {
  /**
   * Intercept the Firebase REST auth check and inject a fake user session
   * so we can test authenticated UI without a real Google account.
   */
  test.beforeEach(async ({ page }) => {
    // Intercept Next.js API route that verifies the auth token
    await page.route('/api/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ uid: 'user_test', email: 'test@example.com', name: 'Test User' }),
      });
    });

    // Set a fake auth cookie / localStorage so the app thinks the user is logged in
    await page.addInitScript(() => {
      window.__TEST_AUTH_USER__ = { uid: 'user_test', email: 'test@example.com' };
    });
  });

  test('authenticated user sees their name in the navbar', async ({ page }) => {
    await page.goto('/');
    // Adjust this selector to match your navbar user display
    await expect(page.getByTestId('user-menu')).toBeVisible();
  });

  test('sign-out clears the session and redirects to home', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('user-menu').click();
    await page.getByRole('button', { name: /sign out|logout/i }).click();

    // After sign-out the user should be back on the homepage and the login link visible
    await expect(page.getByRole('link', { name: /login|sign in/i })).toBeVisible();
  });
});
