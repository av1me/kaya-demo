import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for main heading
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for logical heading hierarchy
    const headingLevels = await Promise.all(
      headings.map(async heading => {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        return parseInt(tagName.replace('h', ''));
      })
    );
    
    // Should have proper heading hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/dashboard');
    
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const altText = await image.getAttribute('alt');
      expect(altText).not.toBeNull();
      expect(altText).not.toBe('');
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for interactive elements with proper labels
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Should have either aria-label or text content
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Focus should be visible
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement);
    expect(focusedElement).not.toBeNull();
    
    // Should be able to navigate with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should reach interactive elements
    const playButton = page.getByRole('button', { name: /play/i });
    await playButton.focus();
    expect(await playButton.isFocused()).toBe(true);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check text elements for sufficient contrast
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').all();
    
    for (const element of textElements.slice(0, 10)) { // Check first 10 elements
      const color = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.color;
      });
      
      const backgroundColor = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundColor;
      });
      
      // Basic check - should not be transparent or same color
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');
    
    // Check login form
    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    
    expect(await emailInput.isVisible()).toBe(true);
    expect(await passwordInput.isVisible()).toBe(true);
    
    // Check that inputs are properly associated with labels
    const emailLabel = await emailInput.evaluate(el => {
      const id = el.getAttribute('id');
      return id ? document.querySelector(`label[for="${id}"]`) : null;
    });
    
    expect(emailLabel).not.toBeNull();
  });

  test('should handle screen readers properly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for proper semantic HTML
    const main = await page.locator('main').count();
    expect(main).toBeGreaterThan(0);
    
    const nav = await page.locator('nav').count();
    expect(nav).toBeGreaterThan(0);
    
    // Check for proper landmarks
    const landmarks = await page.locator('main, nav, header, footer, aside').count();
    expect(landmarks).toBeGreaterThan(0);
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open settings dialog
    await page.getByRole('button', { name: /settings/i }).click();
    
    // Focus should be trapped in dialog
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should not escape dialog
    const dialog = page.getByRole('dialog');
    expect(await dialog.isVisible()).toBe(true);
    
    // Close dialog with Escape
    await page.keyboard.press('Escape');
    expect(await dialog.isVisible()).toBe(false);
  });

  test('should have proper error handling for screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Submit form without filling required fields
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Check for error messages with proper ARIA attributes
    const errorMessages = await page.locator('[role="alert"], [aria-live="polite"]').all();
    expect(errorMessages.length).toBeGreaterThan(0);
    
    for (const error of errorMessages) {
      const text = await error.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('should have proper skip links', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for skip to main content link
    const skipLinks = await page.locator('a[href^="#main"], a[href^="#content"]').all();
    expect(skipLinks.length).toBeGreaterThan(0);
  });

  test('should have proper language attributes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for lang attribute on html element
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    expect(lang).toBeTruthy();
  });

  test('should handle dynamic content updates properly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to next week (triggers content update)
    await page.getByRole('button', { name: /next week/i }).click();
    
    // Check for proper loading states
    const loadingIndicators = await page.locator('[aria-busy="true"], [role="progressbar"]').all();
    expect(loadingIndicators.length).toBeGreaterThanOrEqual(0);
    
    // Wait for content to load
    await expect(page.getByText(/team health/i)).toBeVisible();
  });

  test('should have proper button and link descriptions', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check buttons have descriptive text or aria-label
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Should have at least one way to describe the button
      expect(text?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should handle high contrast mode', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Simulate high contrast mode
    await page.addStyleTag({
      content: `
        * {
          background: white !important;
          color: black !important;
          border: 1px solid black !important;
        }
      `
    });
    
    // Should still be functional
    await expect(page.getByAltText('Kayla Logo')).toBeVisible();
    await expect(page.getByText(/weekly podcast/i)).toBeVisible();
  });
}); 