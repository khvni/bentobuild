import { test, expect } from '@playwright/test';

test.describe('Rich Text Editor - Block Selection and Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('clicking block content selects the block and opens editor panel', async ({ page }) => {
    // Add a hero block
    await page.click('text=Hero');

    // Wait for block to be added to canvas
    await page.waitForSelector('[data-block-type="hero"]', { timeout: 5000 });

    // Click on the hero block's heading content (static HTML display)
    const heroBlock = page.locator('[data-block-type="hero"]').first();
    await heroBlock.locator('div').first().click();

    // Verify block is selected (has yellow ring)
    await expect(heroBlock).toHaveClass(/ring-yellow-400/);

    // Verify BlockEditorPanel opened
    await expect(page.locator('aside[role="complementary"]')).toContainText('Hero Section');

    // Verify RichTextEditor for heading is visible
    await expect(page.locator('label:has-text("Heading")')).toBeVisible();
  });

  test('can edit text in RichTextEditor after selecting block', async ({ page }) => {
    // Add a text block
    await page.click('text=Text');
    await page.waitForSelector('[data-block-type="text"]', { timeout: 5000 });

    // Click on text block content to select it
    const textBlock = page.locator('[data-block-type="text"]').first();
    await textBlock.click();

    // Verify panel opened
    await expect(page.locator('aside[role="complementary"]')).toContainText('Text Block');

    // Find the heading rich text editor in the panel
    const headingEditor = page.locator('.rich-text-editor').first();
    await expect(headingEditor).toBeVisible();

    // Click into the editor
    await headingEditor.locator('.ProseMirror').click();

    // Type some text
    await page.keyboard.type('Test Heading Content');

    // Verify text appears in the editor
    await expect(headingEditor.locator('.ProseMirror')).toContainText('Test Heading Content');

    // Wait a moment for state to update
    await page.waitForTimeout(500);

    // Verify text updates in the canvas block (static HTML)
    await expect(textBlock).toContainText('Test Heading Content');
  });

  test('rich text toolbar formatting works correctly', async ({ page }) => {
    // Add a hero block
    await page.click('text=Hero');
    await page.waitForSelector('[data-block-type="hero"]', { timeout: 5000 });

    // Select the block
    const heroBlock = page.locator('[data-block-type="hero"]').first();
    await heroBlock.click();

    // Find the rich text editor
    const editor = page.locator('.rich-text-editor').first();
    await editor.locator('.ProseMirror').click();

    // Type some text
    await page.keyboard.type('Bold text here');

    // Select all text
    await page.keyboard.press('Control+a');

    // Click bold button in toolbar
    await page.locator('button[title*="Bold"]').first().click();

    // Verify bold formatting applied
    await expect(editor.locator('.ProseMirror strong')).toContainText('Bold text here');
  });

  test('clicking inline input fields does not re-select block', async ({ page }) => {
    // Add a hero block
    await page.click('text=Hero');
    await page.waitForSelector('[data-block-type="hero"]', { timeout: 5000 });

    // Click on hero block to select it
    const heroBlock = page.locator('[data-block-type="hero"]').first();
    await heroBlock.click();

    // Verify panel is open
    await expect(page.locator('aside[role="complementary"]')).toContainText('Hero Section');

    // Find the CTA text input in the hero block (inline input on canvas)
    const ctaInput = heroBlock.locator('input[placeholder="CTA Text"]');

    // Click on the CTA input
    await ctaInput.click();

    // Type into the input
    await page.keyboard.type('Get Started');

    // Verify the input still has focus and text was entered
    await expect(ctaInput).toHaveValue('Get Started');

    // Verify block panel is still open (block remained selected)
    await expect(page.locator('aside[role="complementary"]')).toContainText('Hero Section');
  });

  test('can format text with italic and underline', async ({ page }) => {
    // Add a text block
    await page.click('text=Text');
    await page.waitForSelector('[data-block-type="text"]', { timeout: 5000 });

    // Select the block
    const textBlock = page.locator('[data-block-type="text"]').first();
    await textBlock.click();

    // Find the body rich text editor (second editor in text block)
    const bodyEditor = page.locator('.rich-text-editor').nth(1);
    await bodyEditor.locator('.ProseMirror').click();

    // Type text
    await page.keyboard.type('Italic and underlined text');

    // Select all
    await page.keyboard.press('Control+a');

    // Click italic button
    await page.locator('button[title*="Italic"]').first().click();

    // Verify italic applied
    await expect(bodyEditor.locator('.ProseMirror em, .ProseMirror i')).toContainText('Italic and underlined text');

    // Click underline button
    await page.locator('button[title*="Underline"]').first().click();

    // Verify underline applied
    await expect(bodyEditor.locator('.ProseMirror u')).toContainText('Italic and underlined text');
  });

  test('can change text color in rich text editor', async ({ page }) => {
    // Add a text block
    await page.click('text=Text');
    await page.waitForSelector('[data-block-type="text"]', { timeout: 5000 });

    // Select the block
    const textBlock = page.locator('[data-block-type="text"]').first();
    await textBlock.click();

    // Find the heading editor
    const headingEditor = page.locator('.rich-text-editor').first();
    await headingEditor.locator('.ProseMirror').click();

    // Type text
    await page.keyboard.type('Colored text');

    // Select all
    await page.keyboard.press('Control+a');

    // Find and click the color picker button in toolbar
    const colorButton = page.locator('input[type="color"]').first();
    await colorButton.click();

    // Set color value
    await colorButton.fill('#ff0000');

    // Verify color was applied (check for style attribute)
    const proseMirror = headingEditor.locator('.ProseMirror');
    const html = await proseMirror.innerHTML();
    expect(html).toContain('color');
  });

  test('can change font size in rich text editor', async ({ page }) => {
    // Add a text block
    await page.click('text=Text');
    await page.waitForSelector('[data-block-type="text"]', { timeout: 5000 });

    // Select the block
    const textBlock = page.locator('[data-block-type="text"]').first();
    await textBlock.click();

    // Find the heading editor
    const headingEditor = page.locator('.rich-text-editor').first();
    await headingEditor.locator('.ProseMirror').click();

    // Type text
    await page.keyboard.type('Large text');

    // Select all
    await page.keyboard.press('Control+a');

    // Find and click font size selector in toolbar
    const fontSizeSelect = page.locator('select').first();
    await fontSizeSelect.selectOption('24px');

    // Verify font size was applied
    const proseMirror = headingEditor.locator('.ProseMirror');
    const html = await proseMirror.innerHTML();
    expect(html).toContain('font-size');
  });

  test('auto-focus works on first RichTextEditor when block is selected', async ({ page }) => {
    // Add a hero block
    await page.click('text=Hero');
    await page.waitForSelector('[data-block-type="hero"]', { timeout: 5000 });

    // Select the block
    const heroBlock = page.locator('[data-block-type="hero"]').first();
    await heroBlock.click();

    // Wait for panel to open
    await page.waitForTimeout(300);

    // The first RichTextEditor should be auto-focused
    const firstEditor = page.locator('.rich-text-editor').first().locator('.ProseMirror');

    // Type directly without clicking (should work if auto-focused)
    await page.keyboard.type('Auto-focused text');

    // Verify text was entered
    await expect(firstEditor).toContainText('Auto-focused text');
  });

  test('multiple blocks can be selected and edited in sequence', async ({ page }) => {
    // Add two text blocks
    await page.click('text=Text');
    await page.waitForTimeout(300);
    await page.click('text=Text');
    await page.waitForTimeout(300);

    // Get both text blocks
    const blocks = page.locator('[data-block-type="text"]');
    await expect(blocks).toHaveCount(2);

    // Select first block
    await blocks.nth(0).click();
    await expect(page.locator('aside[role="complementary"]')).toContainText('Text Block');

    // Edit first block
    const firstEditor = page.locator('.rich-text-editor').first();
    await firstEditor.locator('.ProseMirror').click();
    await page.keyboard.type('First block heading');
    await expect(firstEditor.locator('.ProseMirror')).toContainText('First block heading');

    // Select second block
    await blocks.nth(1).click();
    await page.waitForTimeout(300);

    // Edit second block
    const secondEditor = page.locator('.rich-text-editor').first();
    await secondEditor.locator('.ProseMirror').click();
    await page.keyboard.press('Control+a');
    await page.keyboard.type('Second block heading');
    await expect(secondEditor.locator('.ProseMirror')).toContainText('Second block heading');

    // Verify both blocks retained their content
    await expect(blocks.nth(0)).toContainText('First block heading');
    await expect(blocks.nth(1)).toContainText('Second block heading');
  });

  test('clicking outside block content still allows selection via margins', async ({ page }) => {
    // Add a hero block
    await page.click('text=Hero');
    await page.waitForSelector('[data-block-type="hero"]', { timeout: 5000 });

    // Click on the block wrapper (outside the content, on margins/padding)
    const heroBlock = page.locator('[data-block-type="hero"]').first();

    // Get bounding box and click near the edge
    const box = await heroBlock.boundingBox();
    if (box) {
      await page.mouse.click(box.x + 10, box.y + 10);
    }

    // Verify block is selected
    await expect(heroBlock).toHaveClass(/ring-yellow-400/);
    await expect(page.locator('aside[role="complementary"]')).toContainText('Hero Section');
  });
});

test.describe('Rich Text Editor - Image Block Caption', () => {
  test('can edit image caption using rich text editor', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Add an image block
    await page.click('text=Image');
    await page.waitForSelector('[data-block-type="image"]', { timeout: 5000 });

    // Select the image block
    const imageBlock = page.locator('[data-block-type="image"]').first();
    await imageBlock.click();

    // Verify panel opened
    await expect(page.locator('aside[role="complementary"]')).toContainText('Image Block');

    // Find the caption rich text editor
    const captionEditor = page.locator('.rich-text-editor').filter({ hasText: 'Caption' });
    await expect(captionEditor).toBeVisible();

    // Click into caption editor
    await captionEditor.locator('.ProseMirror').click();

    // Type caption
    await page.keyboard.type('Beautiful landscape photo');

    // Verify caption appears
    await expect(captionEditor.locator('.ProseMirror')).toContainText('Beautiful landscape photo');
  });
});
