import { test, expect } from '@playwright/test';

test.describe('Bentobuild', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Website Context')).toBeVisible();
  });

  test('should add a block to canvas', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Hero Section');
    await expect(page.locator('text=Welcome to Our Site')).toBeVisible();
  });

  test('should update context prompt', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a photographer');
    await expect(textarea).toHaveValue('I am a photographer');
  });
});
