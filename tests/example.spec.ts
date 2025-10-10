import { test, expect } from '@playwright/test';

test.describe('Bentoblocks', () => {
  test('should load the main page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Website Context')).toBeVisible();
  });

  test('should add a block to canvas', async ({ page }) => {
    await page.goto('/');
    // Use drag and drop instead of click
    const heroBlock = page.locator('button:has-text("Hero Section")');
    const canvas = page.locator('#main-canvas');
    await heroBlock.dragTo(canvas);
    // Check for the hero heading input instead of text
    await expect(page.locator('input[value="Welcome to Our Site"]')).toBeVisible();
  });

  test('should update context prompt', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a photographer');
    await expect(textarea).toHaveValue('I am a photographer');
  });
});
