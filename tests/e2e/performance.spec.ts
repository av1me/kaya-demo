import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load dashboard within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    
    // Wait for dashboard to be fully loaded
    await expect(page.getByAltText('Kayla Logo')).toBeVisible();
    await expect(page.getByText(/weekly podcast/i)).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: dashboard should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Dashboard load time: ${loadTime}ms`);
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Mock large dataset
    await page.route('**/api/team-health', async route => {
      const largeDataset = {
        success: true,
        data: {
          overallHealth: 85,
          communication: 90,
          collaboration: 88,
          productivity: 82,
          morale: 87,
          trends: {
            weekly: Array.from({ length: 1000 }, (_, i) => Math.random() * 100),
            labels: Array.from({ length: 1000 }, (_, i) => `Day ${i}`)
          }
        }
      };
      
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify(largeDataset)
      });
    });
    
    // Reload to trigger large dataset
    await page.reload();
    
    // Should still load within reasonable time
    await expect(page.getByText(/team health/i)).toBeVisible({ timeout: 5000 });
  });

  test('should maintain responsive performance on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    await page.goto('/dashboard');
    
    await expect(page.getByAltText('Kayla Logo')).toBeVisible();
    await expect(page.getByText(/weekly podcast/i)).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Mobile performance budget: should load within 2.5 seconds
    expect(loadTime).toBeLessThan(2500);
    
    console.log(`Mobile dashboard load time: ${loadTime}ms`);
  });

  test('should handle rapid navigation without performance degradation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate rapidly between weeks
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: /next week/i }).click();
      await page.waitForTimeout(100); // Small delay
      await page.getByRole('button', { name: /previous week/i }).click();
      await page.waitForTimeout(100);
    }
    
    // Should still be responsive
    await expect(page.getByText(/team health/i)).toBeVisible();
  });

  test('should optimize images and assets', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto('/dashboard');
    
    // Check for optimized image requests
    const imageRequests = requests.filter(url => 
      url.includes('.png') || url.includes('.jpg') || url.includes('.svg')
    );
    
    // Should have reasonable number of image requests
    expect(imageRequests.length).toBeLessThan(20);
    
    // Check for lazy loading
    const images = await page.locator('img').count();
    console.log(`Total images on page: ${images}`);
  });

  test('should handle concurrent user interactions', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Simulate multiple concurrent interactions
    const interactions = [
      page.getByRole('button', { name: /play/i }).click(),
      page.getByRole('button', { name: /settings/i }).click(),
      page.getByPlaceholder(/ask noma anything/i).fill('Test question')
    ];
    
    const startTime = Date.now();
    await Promise.all(interactions);
    const interactionTime = Date.now() - startTime;
    
    // Should handle concurrent interactions within 1 second
    expect(interactionTime).toBeLessThan(1000);
    
    console.log(`Concurrent interactions time: ${interactionTime}ms`);
  });

  test('should maintain performance during audio playback', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Start audio playback
    await page.getByRole('button', { name: /play/i }).click();
    
    // Simulate user interactions during playback
    const startTime = Date.now();
    
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: /settings/i }).click();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }
    
    const interactionTime = Date.now() - startTime;
    
    // Should remain responsive during audio playback
    expect(interactionTime).toBeLessThan(2000);
    
    console.log(`Interaction time during audio: ${interactionTime}ms`);
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    const context = page.context();
    
    // Get initial memory usage
    const initialMemory = await context.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    await page.goto('/dashboard');
    
    // Perform multiple interactions
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: /next week/i }).click();
      await page.waitForTimeout(100);
    }
    
    // Get final memory usage
    const finalMemory = await context.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });
    
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
      
      console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);
      
      // Should not increase memory usage by more than 50MB
      expect(memoryIncreaseMB).toBeLessThan(50);
    }
  });
}); 