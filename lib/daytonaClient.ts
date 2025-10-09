import { Daytona } from '@daytonaio/sdk';
import { Block } from '@/types/block.types';

interface PreviewResult {
  success: boolean;
  url?: string;
  error?: string;
  isMock?: boolean;
}

/**
 * Generate static HTML from blocks array
 */
export function generateStaticHTML(blocks: Block[], contextPrompt: string): string {
  const blocksHTML = blocks
    .sort((a, b) => a.order - b.order)
    .map((block) => {
      switch (block.type) {
        case 'hero':
          return `
    <section class="relative px-8 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-5xl font-bold mb-4">${escapeHTML(block.content.heading)}</h1>
        <p class="text-xl mb-8">${escapeHTML(block.content.subheading)}</p>
        ${
          block.content.ctaText
            ? `<a href="${escapeHTML(block.content.ctaLink)}" class="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">${escapeHTML(block.content.ctaText)}</a>`
            : ''
        }
      </div>
    </section>`;

        case 'text':
          return `
    <section class="px-8 py-12 bg-white">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold mb-4 text-gray-900">${escapeHTML(block.content.heading)}</h2>
        <div class="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">${escapeHTML(block.content.body)}</div>
      </div>
    </section>`;

        case 'image':
          return `
    <section class="px-8 py-12 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <img src="${escapeHTML(block.content.src)}" alt="${escapeHTML(block.content.alt)}" class="w-full rounded-lg shadow-lg mb-4" />
        ${block.content.caption ? `<p class="text-center text-gray-600 italic">${escapeHTML(block.content.caption)}</p>` : ''}
      </div>
    </section>`;

        default:
          return '';
      }
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - Bentoblocks</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <meta name="description" content="${escapeHTML(contextPrompt)}">
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
  </style>
</head>
<body class="bg-gray-50">
  ${blocksHTML}

  <footer class="px-8 py-6 bg-gray-900 text-white text-center text-sm">
    <p>Built with <span class="text-purple-400">Bentoblocks</span> - AI-powered website builder</p>
  </footer>
</body>
</html>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(str: string): string {
  const div = typeof document !== 'undefined'
    ? document.createElement('div')
    : null;

  if (div) {
    div.textContent = str;
    return div.innerHTML;
  }

  // Server-side fallback
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Deploy HTML to Daytona sandbox
 */
async function deploySandbox(html: string): Promise<PreviewResult> {
  const apiKey = process.env.DAYTONA_API_KEY;

  if (!apiKey) {
    // Mock mode - return simulated preview
    console.warn('DAYTONA_API_KEY not found - using mock preview mode');
    const mockUrl = `http://localhost:3000/preview/mock-${Date.now()}`;
    return {
      success: true,
      url: mockUrl,
      isMock: true,
    };
  }

  try {
    // Initialize Daytona SDK
    const daytona = new Daytona({ apiKey });

    // Create a Node.js sandbox for serving static HTML
    const sandbox = await daytona.create({
      language: 'typescript',
    });

    // Get working directory
    const workDir = await sandbox.getWorkDir();

    // Write HTML file
    await sandbox.fs.writeFile(`${workDir}/index.html`, html);

    // Create a simple HTTP server script
    const serverScript = `
const http = require('http');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('${workDir}/index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(3000, () => {
  console.log('Preview server running on port 3000');
});
`;

    await sandbox.fs.writeFile(`${workDir}/server.js`, serverScript);

    // Start the server in the background
    await sandbox.process.start({
      cmd: 'node',
      args: ['server.js'],
      cwd: workDir,
    });

    // Get preview link
    const previewLink = await sandbox.getPreviewLink(3000);

    return {
      success: true,
      url: previewLink.url,
      isMock: false,
    };
  } catch (error) {
    console.error('Daytona deployment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown deployment error',
    };
  }
}

/**
 * Main function to create preview
 */
export async function createPreview(
  blocks: Block[],
  contextPrompt: string
): Promise<PreviewResult> {
  try {
    // Generate static HTML
    const html = generateStaticHTML(blocks, contextPrompt);

    // Deploy to Daytona sandbox
    const result = await deploySandbox(html);

    return result;
  } catch (error) {
    console.error('Preview creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create preview',
    };
  }
}
