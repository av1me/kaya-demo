import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    const emailInput = page.getByLabel('Email');
    await emailInput.fill('invalid-email');

    const signInButton = page.getByRole('button', { name: 'Sign in' });
    await signInButton.click();

    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    const signInButton = page.getByRole('button', { name: 'Sign in' });

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await signInButton.click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByAltText('Kayla Logo')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    const toggleButton = page.getByRole('button', { name: 'Toggle password visibility' });

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle to hide password again
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', route => route.abort());

    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    const signInButton = page.getByRole('button', { name: 'Sign in' });

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    await signInButton.click();

    // Should show error message
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });
}); 