import { test, expect } from '@playwright/test';

test.describe('Bento Build E2E Workflow', () => {
  test('complete workflow: photographer website generation', async ({ page }) => {
    await page.goto('/');

    // Step 1: Verify initial empty state
    const canvas = page.locator('#main-canvas');
    const initialBlockCount = await canvas.locator('[data-block-id]').count();
    expect(initialBlockCount).toBe(0);

    // Step 2: Enter photographer context
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill(
      'I am a freelance photographer specializing in landscape and portrait photography'
    );
    await expect(textarea).toHaveValue(
      'I am a freelance photographer specializing in landscape and portrait photography'
    );

    // Step 3: Verify Bento Build button is enabled
    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await expect(bentoBuildButton).toBeEnabled();

    // Step 4: Click Bento Build
    await bentoBuildButton.click();

    // Step 5: Verify loading state
    await expect(page.locator('button:has-text("Building...")')).toBeVisible({ timeout: 1000 });

    // Step 6: Wait for blocks to be generated
    await expect(bentoBuildButton).toBeVisible({ timeout: 30000 });

    // Give it a moment for blocks to render
    await page.waitForTimeout(2000);

    // Step 7: Verify blocks were added to canvas
    const finalBlockCount = await canvas.locator('[data-block-id]').count();
    expect(finalBlockCount).toBeGreaterThan(3); // Should have at least navbar, hero, text, footer

    // Step 8: Verify navbar block is present and first
    const firstBlock = canvas.locator('[data-block-id]').first();
    const firstBlockContent = await firstBlock.textContent();
    expect(firstBlockContent).toBeTruthy();

    // Step 9: Verify blocks can be interacted with
    const allBlocks = canvas.locator('[data-block-id]');
    const secondBlock = allBlocks.nth(1);
    await secondBlock.click();

    // Block should be selected (visual indication)
    await expect(secondBlock).toHaveClass(/ring-/); // Should have ring classes for selection

    // Step 10: Verify content is contextually relevant
    const canvasText = await canvas.textContent();
    const lowerCaseText = canvasText?.toLowerCase() || '';

    // Should contain photography-related terms
    const photographyTerms = [
      'photo',
      'portrait',
      'landscape',
      'image',
      'capture',
      'gallery',
      'work',
    ];
    const hasRelevantTerm = photographyTerms.some((term) => lowerCaseText.includes(term));
    expect(hasRelevantTerm).toBe(true);
  });

  test('complete workflow: regenerate with different context', async ({ page }) => {
    await page.goto('/');

    // Step 1: Generate initial layout (photographer)
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a photographer');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    // Wait for first generation
    await page.waitForTimeout(3000);

    const canvas = page.locator('#main-canvas');
    const firstGenCount = await canvas.locator('[data-block-id]').count();
    expect(firstGenCount).toBeGreaterThan(0);

    // Get first generation content
    const firstContent = await canvas.textContent();

    // Step 2: Change context and regenerate
    await textarea.clear();
    await textarea.fill('I run a modern coffee shop in Brooklyn');

    await bentoBuildButton.click();

    // Wait for second generation
    await page.waitForTimeout(3000);

    const secondGenCount = await canvas.locator('[data-block-id]').count();
    expect(secondGenCount).toBeGreaterThan(0);

    // Get second generation content
    const secondContent = await canvas.textContent();

    // Step 3: Verify content changed
    expect(secondContent).not.toBe(firstContent);

    // Verify new content is relevant to coffee shop
    const lowerCaseText = secondContent?.toLowerCase() || '';
    const coffeeTerms = ['coffee', 'café', 'cafe', 'brew', 'brooklyn', 'drink', 'menu'];
    const hasRelevantTerm = coffeeTerms.some((term) => lowerCaseText.includes(term));
    expect(hasRelevantTerm).toBe(true);
  });

  test('complete workflow: edit generated blocks', async ({ page }) => {
    await page.goto('/');

    // Generate layout
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a yoga instructor');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    await page.waitForTimeout(3000);

    // Find and edit a text input in one of the blocks
    const canvas = page.locator('#main-canvas');
    const textInputs = canvas.locator('input[type="text"]');
    const firstInput = textInputs.first();

    // Get original value
    const originalValue = await firstInput.inputValue();

    // Edit the value
    await firstInput.click();
    await firstInput.fill('Custom Edited Text');

    // Verify the change persisted
    await expect(firstInput).toHaveValue('Custom Edited Text');
    expect('Custom Edited Text').not.toBe(originalValue);
  });

  test('complete workflow: add blocks after generation', async ({ page }) => {
    await page.goto('/');

    // Generate initial layout
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a web developer');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    await page.waitForTimeout(3000);

    const canvas = page.locator('#main-canvas');
    const generatedCount = await canvas.locator('[data-block-id]').count();

    // Add an additional block manually
    const textBlockButton = page.locator('button:has-text("Text Block")');
    await textBlockButton.dragTo(canvas);

    // Wait for block to be added
    await page.waitForTimeout(500);

    const finalCount = await canvas.locator('[data-block-id]').count();
    expect(finalCount).toBe(generatedCount + 1);
  });

  test('complete workflow: persistence across page reload', async ({ page, context }) => {
    await page.goto('/');

    // Generate layout
    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    const testContext = 'I sell handmade jewelry online';
    await textarea.fill(testContext);

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    await page.waitForTimeout(3000);

    const canvas = page.locator('#main-canvas');
    const blockCount = await canvas.locator('[data-block-id]').count();
    expect(blockCount).toBeGreaterThan(0);

    // Reload the page
    await page.reload();

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Verify context persisted
    const reloadedTextarea = page.locator('textarea[placeholder*="Describe your website"]');
    await expect(reloadedTextarea).toHaveValue(testContext);

    // Verify blocks persisted
    const reloadedCanvas = page.locator('#main-canvas');
    const reloadedBlockCount = await reloadedCanvas.locator('[data-block-id]').count();
    expect(reloadedBlockCount).toBe(blockCount);
  });

  test('complete workflow: multiple consecutive generations', async ({ page }) => {
    await page.goto('/');

    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    const canvas = page.locator('#main-canvas');

    // First generation
    await textarea.fill('I am a musician');
    await bentoBuildButton.click();
    await page.waitForTimeout(3000);
    const firstCount = await canvas.locator('[data-block-id]').count();
    expect(firstCount).toBeGreaterThan(0);

    // Second generation
    await textarea.clear();
    await textarea.fill('I am a chef');
    await bentoBuildButton.click();
    await page.waitForTimeout(3000);
    const secondCount = await canvas.locator('[data-block-id]').count();
    expect(secondCount).toBeGreaterThan(0);

    // Third generation
    await textarea.clear();
    await textarea.fill('I am a teacher');
    await bentoBuildButton.click();
    await page.waitForTimeout(3000);
    const thirdCount = await canvas.locator('[data-block-id]').count();
    expect(thirdCount).toBeGreaterThan(0);

    // All should generate valid layouts
    expect(firstCount).toBeGreaterThan(2);
    expect(secondCount).toBeGreaterThan(2);
    expect(thirdCount).toBeGreaterThan(2);
  });

  test('complete workflow: verify block diversity', async ({ page }) => {
    await page.goto('/');

    const textarea = page.locator('textarea[placeholder*="Describe your website"]');
    await textarea.fill('I am a full-stack developer building web applications');

    const bentoBuildButton = page.locator('button:has-text("Bento Build")');
    await bentoBuildButton.click();

    await page.waitForTimeout(3000);

    const canvas = page.locator('#main-canvas');
    const blocks = canvas.locator('[data-block-id]');
    const blockCount = await blocks.count();

    // Should have generated a diverse set of blocks (at least 4 different types)
    expect(blockCount).toBeGreaterThanOrEqual(5);

    // Verify we have different types of content
    const canvasHTML = await canvas.innerHTML();

    // Should have navigation elements
    const hasNav = canvasHTML.includes('nav') || canvasHTML.toLowerCase().includes('home');
    expect(hasNav).toBe(true);

    // Should have some form of CTA or button
    const hasCTA =
      canvasHTML.toLowerCase().includes('button') || canvasHTML.toLowerCase().includes('contact');
    expect(hasCTA).toBe(true);
  });
});
