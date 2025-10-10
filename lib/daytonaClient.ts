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
  if (!blocks || blocks.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Empty Preview - Bentoblocks</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">No Content</h1>
    <p class="text-gray-600">Add blocks to your canvas to preview your site.</p>
  </div>
</body>
</html>`;
  }

  const blocksHTML = blocks
    .sort((a, b) => a.order - b.order)
    .map((block) => {
      try {
        switch (block.type) {
          case 'hero': {
            const bgColor = block.content.backgroundColor || '#3B82F6';
            const textColor = block.content.textColor || '#FFFFFF';
            const buttonBg = block.content.buttonColor || '#FFFFFF';
            const buttonText = block.content.buttonTextColor || '#3B82F6';

            return `
    <section class="relative px-8 py-16" style="background-color: ${bgColor}; color: ${textColor};">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-5xl font-bold mb-4">${escapeHTML(block.content.heading)}</h1>
        <p class="text-xl mb-8">${escapeHTML(block.content.subheading)}</p>
        ${
          block.content.ctaText
            ? `<a href="${escapeHTML(block.content.ctaLink)}" class="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90" style="background-color: ${buttonBg}; color: ${buttonText};">${escapeHTML(block.content.ctaText)}</a>`
            : ''
        }
      </div>
    </section>`;
          }

          case 'text': {
            const bgColor = block.content.backgroundColor || '#FFFFFF';
            const headingColor = block.content.headingColor || '#111827';
            const textColor = block.content.textColor || '#4B5563';

            return `
    <section class="px-8 py-12" style="background-color: ${bgColor};">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold mb-4" style="color: ${headingColor};">${escapeHTML(block.content.heading)}</h2>
        <div class="text-lg leading-relaxed whitespace-pre-wrap" style="color: ${textColor};">${escapeHTML(block.content.body)}</div>
      </div>
    </section>`;
          }

          case 'image': {
            const bgColor = block.content.backgroundColor || '#F9FAFB';
            const captionColor = block.content.captionColor || '#4B5563';

            return `
    <section class="px-8 py-12" style="background-color: ${bgColor};">
      <div class="max-w-4xl mx-auto">
        <img src="${escapeHTML(block.content.src)}" alt="${escapeHTML(block.content.alt)}" class="w-full rounded-lg shadow-lg mb-4" />
        ${block.content.caption ? `<p class="text-center italic" style="color: ${captionColor};">${escapeHTML(block.content.caption)}</p>` : ''}
      </div>
    </section>`;
          }

          case 'button': {
            const buttonStyle = block.content.style || 'filled';
            const backgroundColor = block.content.backgroundColor || '#3B82F6';
            const textColor = block.content.textColor || '#FFFFFF';
            const borderColor = block.content.borderColor || backgroundColor;
            let buttonClass = 'inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200';
            let styleAttr = '';

            if (buttonStyle === 'filled') {
              buttonClass += ' shadow-md hover:shadow-lg';
              styleAttr = `background-color: ${backgroundColor}; color: ${textColor};`;
            } else if (buttonStyle === 'outlined') {
              buttonClass += ' border-2';
              styleAttr = `border-color: ${borderColor}; color: ${borderColor};`;
            } else if (buttonStyle === 'text') {
              styleAttr = `color: ${textColor};`;
            }

            return `
    <section class="px-8 py-12 bg-white">
      <div class="max-w-2xl mx-auto text-center">
        <a href="${escapeHTML(block.content.url)}" class="${buttonClass}" style="${styleAttr}">${escapeHTML(block.content.text)}</a>
      </div>
    </section>`;
          }

          case 'link': {
            const bgColor = block.content.backgroundColor || '#FFFFFF';
            const textColor = block.content.textColor || '#4B5563';
            const linkColor = block.content.linkColor || '#3B82F6';

            return `
    <section class="px-8 py-12 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors" style="background-color: ${bgColor};">
      <div class="max-w-2xl mx-auto">
        <a href="${escapeHTML(block.content.url)}" class="flex items-start gap-3 group">
          <svg class="w-6 h-6 flex-shrink-0 mt-1 transition-colors" style="color: ${linkColor};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <div>
            <h3 class="text-2xl font-semibold mb-2 transition-colors" style="color: ${linkColor};">${escapeHTML(block.content.text)}</h3>
            ${block.content.description ? `<p style="color: ${textColor};">${escapeHTML(block.content.description)}</p>` : ''}
            <p class="text-sm mt-2 font-mono" style="color: ${textColor}; opacity: 0.8;">${escapeHTML(block.content.url)}</p>
          </div>
        </a>
      </div>
    </section>`;
          }

          case 'navbar': {
            const links = block.content.links || [];
            const bgColor = block.content.backgroundColor || '#FFFFFF';
            const textColor = block.content.textColor || '#111827';
            const linkColor = block.content.linkColor || '#4B5563';
            const linkHoverColor = block.content.linkHoverColor || '#3B82F6';

            const linksHTML = links.map(link =>
              `<a href="${escapeHTML(link.url)}" class="font-medium transition-colors" style="color: ${linkColor};" onmouseover="this.style.color='${linkHoverColor}'" onmouseout="this.style.color='${linkColor}'">${escapeHTML(link.text)}</a>`
            ).join('\n            ');

            return `
    <nav class="border-b-2 border-gray-200 shadow-sm sticky top-0 z-50" style="background-color: ${bgColor};">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            ${block.content.logoUrl ? `<img src="${escapeHTML(block.content.logoUrl)}" alt="${escapeHTML(block.content.brandName)}" class="h-8 w-8 object-contain" />` : ''}
            <span class="text-xl font-bold" style="color: ${textColor};">${escapeHTML(block.content.brandName)}</span>
          </div>
          <div class="hidden md:flex items-center gap-6">
            ${linksHTML}
          </div>
          <button class="md:hidden p-2 rounded-lg transition-colors" style="color: ${linkColor};" onmouseover="this.style.backgroundColor='rgba(0,0,0,0.05)'" onmouseout="this.style.backgroundColor='transparent'" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="hidden md:hidden absolute top-16 left-0 right-0 border-b border-gray-200 shadow-lg p-4" style="background-color: ${bgColor};">
            <div class="flex flex-col gap-3">
              ${links.map(link => `<a href="${escapeHTML(link.url)}" class="font-medium py-2 transition-colors" style="color: ${linkColor};" onmouseover="this.style.color='${linkHoverColor}'" onmouseout="this.style.color='${linkColor}'">${escapeHTML(link.text)}</a>`).join('\n              ')}
            </div>
          </div>
        </div>
      </div>
    </nav>`;
          }

          case 'footer': {
            const socialLinks = block.content.socialLinks || [];
            const bgColor = block.content.backgroundColor || '#111827';
            const textColor = block.content.textColor || '#FFFFFF';
            const linkColor = block.content.linkColor || '#9CA3AF';

            const socialLinksHTML = socialLinks.map(link =>
              `<a href="${escapeHTML(link.url)}" class="transition-colors hover:underline" style="color: ${linkColor};">${escapeHTML(link.platform)}</a>`
            ).join('\n            ');

            return `
    <footer class="border-t-4 border-yellow-400" style="background-color: ${bgColor}; color: ${textColor};">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 class="text-xl font-bold mb-3">${escapeHTML(block.content.companyName)}</h3>
            <p class="text-sm" style="color: ${linkColor};">
              <a href="mailto:${escapeHTML(block.content.contactEmail)}" class="hover:underline">${escapeHTML(block.content.contactEmail)}</a>
            </p>
          </div>
          <div class="flex items-center justify-center">
            <p class="text-sm" style="color: ${linkColor};">${escapeHTML(block.content.copyright)}</p>
          </div>
          <div>
            <p class="text-sm font-semibold mb-3 uppercase tracking-wide" style="color: ${linkColor};">Connect</p>
            <div class="flex flex-col gap-2 text-sm">
              ${socialLinksHTML}
            </div>
          </div>
        </div>
      </div>
    </footer>`;
          }

          default:
            return '';
        }
      } catch (error) {
        console.error('Error rendering block:', block.id, error);
        return `<!-- Error rendering block ${block.id} -->`;
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
function escapeHTML(str: string | undefined): string {
  if (!str) return '';

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

    console.log('Creating Daytona sandbox for live preview...');

    // Create a new sandbox with Node.js/web server capabilities
    const sandbox = await daytona.create({
      language: 'javascript',
      envVars: {
        NODE_ENV: 'production',
      },
    });

    console.log('Sandbox created, uploading HTML content...');

    // Verify Node.js is available in the sandbox
    const nodeCheck = await sandbox.process.executeCommand('node --version');
    console.log('Node.js version:', nodeCheck.artifacts?.stdout?.trim());

    // Create public directory structure
    await sandbox.fs.createFolder('public', '755');

    // Upload the HTML content to index.html
    await sandbox.fs.uploadFile(
      Buffer.from(html, 'utf-8'),
      'public/index.html'
    );

    // Create a simple HTTP server script to serve the HTML
    const serverScript = `
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');

  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading page');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

    // Upload the server script
    await sandbox.fs.uploadFile(
      Buffer.from(serverScript, 'utf-8'),
      'server.js'
    );

    console.log('Starting web server in sandbox...');

    // Start the HTTP server in the background using nohup for persistence
    const startResult = await sandbox.process.executeCommand(
      'nohup node server.js > server.log 2>&1 & echo $!'
    );

    console.log('Server started with PID:', startResult.artifacts?.stdout?.trim());

    // Wait a moment for the server to start and listen
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get the preview URL for port 3000
    const previewLink = await sandbox.getPreviewLink(3000);

    console.log('Deployment successful! Preview URL:', previewLink.url);

    return {
      success: true,
      url: previewLink.url,
      isMock: false,
    };
  } catch (error) {
    console.error('Daytona deployment error:', error);

    // Fall back to mock mode on error
    const mockUrl = `http://localhost:3000/preview/mock-${Date.now()}`;
    return {
      success: true,
      url: mockUrl,
      isMock: true,
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
