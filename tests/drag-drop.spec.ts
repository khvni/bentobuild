import { test, expect } from '@playwright/test';

test.describe('Drag and Drop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add blocks to canvas via drag and drop', async ({ page }) => {
    // Add a hero block via drag and drop
    const heroBlock = page.locator('button:has-text("Hero Section")');
    const canvas = page.locator('#main-canvas');
    await heroBlock.dragTo(canvas);

    // Verify hero block was added by checking for input with hero heading value
    await expect(page.locator('input[value="Welcome to Our Site"]')).toBeVisible();

    // Add a text block via drag and drop
    const textBlock = page.locator('button:has-text("Text Block")');
    await textBlock.dragTo(canvas);

    // Verify text block was added
    await expect(page.locator('input[value="Section Heading"]')).toBeVisible();

    // Verify block count shows 2
    await expect(page.locator('[role="list"][aria-label*="2 blocks"]')).toBeVisible();
  });

  test('should select a block when clicked', async ({ page }) => {
    // Add a hero block via drag and drop
    const heroPalette = page.locator('button:has-text("Hero Section")');
    const canvas = page.locator('#main-canvas');
    await heroPalette.dragTo(canvas);

    // Wait for block to appear
    await page.waitForSelector('input[value="Welcome to Our Site"]');

    // Click on the block to select it
    const heroBlock = page.locator('[role="listitem"]').first();
    await heroBlock.click();

    // Verify selection ring is visible (yellow ring)
    const selectedBlock = page.locator('.ring-yellow-400').first();
    await expect(selectedBlock).toBeVisible();
  });

  test('should show action buttons on block selection', async ({ page }) => {
    // Add a hero block via drag and drop
    const heroPalette = page.locator('button:has-text("Hero Section")');
    const canvas = page.locator('#main-canvas');
    await heroPalette.dragTo(canvas);

    await page.waitForSelector('input[value="Welcome to Our Site"]');

    // Click to select the block
    const heroBlock = page.locator('[role="listitem"]').first();
    await heroBlock.click();

    // Verify delete and duplicate buttons are visible
    const deleteButton = page.locator('button[aria-label*="Delete"]').first();
    const duplicateButton = page.locator('button[aria-label*="Duplicate"]').first();

    await expect(deleteButton).toBeVisible();
    await expect(duplicateButton).toBeVisible();
  });

  test('should delete a block', async ({ page }) => {
    // Add a hero block via drag and drop
    const heroPalette = page.locator('button:has-text("Hero Section")');
    const canvas = page.locator('#main-canvas');
    await heroPalette.dragTo(canvas);

    await expect(page.locator('input[value="Welcome to Our Site"]')).toBeVisible();

    // Click to select the block
    const heroBlock = page.locator('[role="listitem"]').first();
    await heroBlock.click();

    // Click delete button
    const deleteButton = page.locator('button[aria-label*="Delete"]').first();
    await deleteButton.click();

    // Verify block is removed
    await expect(page.locator('input[value="Welcome to Our Site"]')).not.toBeVisible();
    await expect(page.locator('text=Empty Canvas')).toBeVisible();
  });

  test('should duplicate a block', async ({ page }) => {
    // Add a text block via drag and drop
    const textPalette = page.locator('button:has-text("Text Block")');
    const canvas = page.locator('#main-canvas');
    await textPalette.dragTo(canvas);

    await page.waitForSelector('input[value="Section Heading"]');

    // Click to select the block
    const textBlock = page.locator('[role="listitem"]').first();
    await textBlock.click();

    // Click duplicate button
    const duplicateButton = page.locator('button[aria-label*="Duplicate"]').first();
    await duplicateButton.click();

    // Wait for the duplicate to appear
    await page.waitForTimeout(500);

    // Verify there are now 2 blocks with the same heading
    const blocks = page.locator('input[value="Section Heading"]');
    await expect(blocks).toHaveCount(2);
  });

  test('should show drag handle on block selection', async ({ page }) => {
    // Add a hero block via drag and drop
    const heroPalette = page.locator('button:has-text("Hero Section")');
    const canvas = page.locator('#main-canvas');
    await heroPalette.dragTo(canvas);

    await page.waitForSelector('input[value="Welcome to Our Site"]');

    // Click to select the block
    const heroBlock = page.locator('[role="listitem"]').first();
    await heroBlock.click();

    // Verify drag handle is visible
    const dragHandle = page.locator('button[aria-label*="Drag to reorder"]').first();
    await expect(dragHandle).toBeVisible();
  });

  test('should allow editing block content', async ({ page }) => {
    // Add a text block via drag and drop
    const textPalette = page.locator('button:has-text("Text Block")');
    const canvas = page.locator('#main-canvas');
    await textPalette.dragTo(canvas);

    await page.waitForSelector('input[value="Section Heading"]');

    // Select the block
    const textBlock = page.locator('[role="listitem"]').first();
    await textBlock.click();

    // Edit the heading
    const headingInput = page.locator('input[value="Section Heading"]').first();
    await headingInput.fill('New Custom Heading');

    // Verify the new content is saved
    await expect(page.locator('input[value="New Custom Heading"]')).toBeVisible();

    // Verify the block still shows as selected
    await expect(page.locator('.ring-yellow-400')).toBeVisible();
  });
});
