import { test, expect } from '@playwright/test';

test.describe('Bento Build UI', () => {
  test('should display Bento Build button in ContextBar', async ({ page }) => {
    await page.goto('/');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await expect(bentoBuildButton).toBeVisible();

    // Check for Sparkles icon
    const sparklesIcon = bentoBuildButton.locator('svg');
    await expect(sparklesIcon).toBeVisible();
  });

  test('should have Bento Build button disabled when context is empty', async ({ page }) => {
    await page.goto('/');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await expect(bentoBuildButton).toBeDisabled();
  });

  test('should enable Bento Build button when context is entered', async ({ page }) => {
    await page.goto('/');

    // Enter context
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a photographer');

    // Button should be enabled
    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await expect(bentoBuildButton).toBeEnabled();
  });

  test('should show loading state when Bento Build is clicked', async ({ page }) => {
    await page.goto('/');

    // Enter context
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a freelance photographer');

    // Click Bento Build
    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    // Should show "Building..." text with spinner
    await expect(page.locator('button:has-text("Building...")')).toBeVisible({ timeout: 1000 });

    // Wait for completion (button should return to "Bento Build")
    await expect(bentoBuildButton).toBeVisible({ timeout: 30000 });
  });

  test('should generate blocks on canvas after clicking Bento Build', async ({ page }) => {
    await page.goto('/');

    // Check initial canvas state - should be empty
    const canvas = page.locator('#main-canvas');
    const initialBlocks = await canvas.locator('[data-block-id]').count();
    expect(initialBlocks).toBe(0);

    // Enter context
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I run a coffee shop');

    // Click Bento Build
    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    // Wait for blocks to appear (should take a few seconds)
    await page.waitForTimeout(3000);

    // Check that blocks were added
    const finalBlocks = await canvas.locator('[data-block-id]').count();
    expect(finalBlocks).toBeGreaterThan(0);
  });

  test('should clear existing blocks when Bento Build is used', async ({ page }) => {
    await page.goto('/');

    // Add a block manually first
    const heroBlock = page.locator('button:has-text("Hero Section")');
    const canvas = page.locator('#main-canvas');
    await heroBlock.dragTo(canvas);

    // Verify block was added
    await expect(page.locator('input[value="Welcome to Our Site"]')).toBeVisible();

    // Now use Bento Build
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a yoga instructor');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    // Wait for generation
    await page.waitForTimeout(3000);

    // Original block should be replaced
    await expect(page.locator('input[value="Welcome to Our Site"]')).not.toBeVisible();

    // New blocks should be present
    const blocks = await canvas.locator('[data-block-id]').count();
    expect(blocks).toBeGreaterThan(0);
  });

  test('should display error message on API failure', async ({ page }) => {
    // Intercept the API call and make it fail
    await page.route('/api/bento-build', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Test error' }),
      });
    });

    await page.goto('/');

    // Enter context and click Bento Build
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a photographer');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    // Should show error message
    await expect(page.locator('text=Test error')).toBeVisible({ timeout: 5000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept and abort the API call to simulate network error
    await page.route('/api/bento-build', route => route.abort());

    await page.goto('/');

    // Enter context and click Bento Build
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a photographer');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    // Should show network error message
    await expect(page.locator('text=Network error')).toBeVisible({ timeout: 5000 });
  });

  test('should not trigger build when button is clicked while building', async ({ page }) => {
    await page.goto('/');

    // Enter context
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a photographer');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');

    // Click once
    await bentoBuildButton.click();

    // Try clicking again while building (should be disabled)
    await expect(page.locator('button:has-text("Building...")')).toBeDisabled();
  });

  test('should have proper button styling and accessibility', async ({ page }) => {
    await page.goto('/');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');

    // Check for title attribute (tooltip)
    await expect(bentoBuildButton).toHaveAttribute('title', 'Generate complete website layout with AI');

    // Check for proper disabled styling when no context
    const disabledClasses = await bentoBuildButton.getAttribute('class');
    expect(disabledClasses).toContain('cursor-not-allowed');

    // Add context to enable
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('Test context');

    // Check for enabled styling
    const enabledClasses = await bentoBuildButton.getAttribute('class');
    expect(enabledClasses).toContain('bauhaus-blue');
  });

  test('should display Bento Build button before Save button', async ({ page }) => {
    await page.goto('/');

    const buttonContainer = page.locator('.pt-9.flex.gap-3');
    const buttons = buttonContainer.locator('button');

    // Get button texts
    const firstButtonText = await buttons.nth(0).textContent();
    const secondButtonText = await buttons.nth(1).textContent();

    expect(firstButtonText).toContain('Bento Build');
    expect(secondButtonText).toContain('Save');
  });
});
