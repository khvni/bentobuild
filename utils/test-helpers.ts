/**
 * Test helper utilities
 * Shared utilities for Playwright E2E tests
 */

import { Page, expect } from '@playwright/test';

/**
 * Wait for an element to be visible
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Fill an input field and verify the value
 */
export async function fillAndVerify(page: Page, selector: string, value: string) {
  await page.fill(selector, value);
  await expect(page.locator(selector)).toHaveValue(value);
}

/**
 * Click and wait for navigation
 */
export async function clickAndNavigate(page: Page, selector: string) {
  await Promise.all([page.waitForNavigation(), page.click(selector)]);
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  callback: () => Promise<void>
) {
  const responsePromise = page.waitForResponse(urlPattern);
  await callback();
  return responsePromise;
}

/**
 * Get block count on canvas
 */
export async function getBlockCount(page: Page): Promise<number> {
  const blocks = await page.locator('[data-testid^="block-"]').count();
  return blocks;
}

/**
 * Add a block to canvas
 */
export async function addBlock(page: Page, blockType: string) {
  await page.click(`[data-testid="palette-${blockType}"]`);
}

/**
 * Select a block on canvas
 */
export async function selectBlock(page: Page, blockId: string) {
  await page.click(`[data-testid="block-${blockId}"]`);
}

/**
 * Delete selected block
 */
export async function deleteSelectedBlock(page: Page) {
  await page.click('[data-testid="delete-block-button"]');
}

/**
 * Wait for loading state to complete
 */
export async function waitForLoading(page: Page, timeout = 10000) {
  await page.waitForSelector('[data-testid="loading-indicator"]', {
    state: 'hidden',
    timeout,
  });
}

/**
 * Check if element has specific class
 */
export async function hasClass(page: Page, selector: string, className: string): Promise<boolean> {
  const element = page.locator(selector);
  const classes = await element.getAttribute('class');
  return classes?.includes(className) ?? false;
}

/**
 * Mock API response
 */
export async function mockAPIResponse(
  page: Page,
  url: string | RegExp,
  response: any,
  status = 200
) {
  await page.route(url, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}
