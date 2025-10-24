import { test, expect } from '@playwright/test';

test.describe('Bento Build API', () => {
  test('should return error when contextPrompt is missing', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: {},
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('contextPrompt');
  });

  test('should return error when contextPrompt is empty string', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: '' },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('contextPrompt');
  });

  test('should generate blocks for valid photographer context', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: {
        contextPrompt: 'I am a freelance photographer specializing in landscape photography',
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.blocks).toBeDefined();
    expect(Array.isArray(data.blocks)).toBe(true);
    expect(data.blocks.length).toBeGreaterThan(0);
    expect(data.blocks.length).toBeLessThanOrEqual(10);
  });

  test('should generate blocks with proper structure', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: 'I run a modern coffee shop in Brooklyn' },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);

    // Validate first block structure
    const firstBlock = data.blocks[0];
    expect(firstBlock).toHaveProperty('id');
    expect(firstBlock).toHaveProperty('type');
    expect(firstBlock).toHaveProperty('order');
    expect(firstBlock).toHaveProperty('content');

    // Validate ID format
    expect(firstBlock.id).toMatch(/^[a-z]+-\d+-\d+$/);

    // Validate type is valid
    const validTypes = ['hero', 'text', 'image', 'button', 'link', 'navbar', 'footer'];
    expect(validTypes).toContain(firstBlock.type);

    // Validate order is a number
    expect(typeof firstBlock.order).toBe('number');

    // Validate content is an object
    expect(typeof firstBlock.content).toBe('object');
  });

  test('should start with navbar and end with footer', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: 'I am a personal trainer offering fitness coaching' },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.blocks.length).toBeGreaterThan(2);

    // First block should typically be navbar
    const firstBlock = data.blocks[0];
    expect(firstBlock.type).toBe('navbar');
    expect(firstBlock.order).toBe(0);

    // Last block should typically be footer
    const lastBlock = data.blocks[data.blocks.length - 1];
    expect(lastBlock.type).toBe('footer');
  });

  test('should generate context-relevant content', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: 'I sell handmade jewelry online' },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);

    // Check that content contains relevant keywords
    const allContent = JSON.stringify(data.blocks).toLowerCase();

    // Should contain jewelry-related terms (at least one)
    const jewelryTerms = ['jewelry', 'jewellery', 'handmade', 'craft', 'artisan', 'collection'];
    const hasRelevantTerm = jewelryTerms.some((term) => allContent.includes(term));
    expect(hasRelevantTerm).toBe(true);
  });

  test('should generate unique IDs for each block', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: 'I am a yoga instructor' },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);

    // Extract all IDs
    const ids = data.blocks.map((block: { id: string }) => block.id);

    // Check for uniqueness
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('should have sequential order numbers', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: 'I am a web developer' },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);

    // Check that order numbers are sequential (0, 1, 2, ...)
    data.blocks.forEach((block: { order: number }, index: number) => {
      expect(block.order).toBe(index);
    });
  });

  test('should handle long context prompts', async ({ request }) => {
    const longContext =
      'I am a freelance graphic designer specializing in brand identity, logo design, and marketing materials. I have 10 years of experience working with clients across various industries including tech startups, fashion brands, and non-profit organizations. My design philosophy emphasizes clean aesthetics and meaningful storytelling.';

    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: longContext },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.blocks).toBeDefined();
    expect(data.blocks.length).toBeGreaterThan(0);
  });

  test('should handle special characters in context', async ({ request }) => {
    const response = await request.post('/api/bento-build', {
      data: { contextPrompt: 'I run "The Best Café" & it\'s amazing! #1 in NYC' },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.blocks).toBeDefined();
  });
});
