/**
 * Bento Build API Endpoint
 *
 * This endpoint generates a complete website scaffold using AI based on user context.
 * It analyzes the context prompt and returns a structured array of blocks that form
 * a cohesive website layout.
 *
 * @route POST /api/bento-build
 *
 * @body {
 *   contextPrompt: string - Description of the website/business
 * }
 *
 * @returns {
 *   success: boolean,
 *   blocks?: Block[],
 *   error?: string
 * }
 *
 * @example
 * POST /api/bento-build
 * {
 *   "contextPrompt": "I'm a freelance photographer specializing in landscape photography"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "blocks": [
 *     { id: "navbar-1234567890-0", type: "navbar", order: 0, content: {...} },
 *     { id: "hero-1234567890-1", type: "hero", order: 1, content: {...} },
 *     ...
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { openai, CONTENT_GENERATION_CONFIG } from '@/lib/openai';
import { Block, BlockType } from '@/types/block.types';
import { getContextualImageUrl, extractImageKeywords } from '@/lib/unsplash';
import { secureApi } from '@/lib/middleware/apiWrapper';
import {
  validateInput,
  bentoBuildSchema,
  sanitizeAIPrompt,
  sanitizeBlockContent,
} from '@/lib/security/sanitize';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BentoBuildRequest {
  contextPrompt: string;
}

interface BentoBuildResponse {
  success: boolean;
  blocks?: Block[];
  error?: string;
}

/**
 * Builds the AI prompt for generating a complete website structure
 */
function buildBentoBuildPrompt(contextPrompt: string): string {
  return `You are a professional web designer and copywriter creating a complete, high-converting website.

User's website context: "${contextPrompt}"

Based on this context, generate a complete website layout with professional, concise copy. Return ONLY a JSON object with a "blocks" array.

Available block types:
- navbar: Navigation bar with brand name and links
- hero: Main hero section with heading, subheading, and CTA
- text: Text content sections with heading and body (1-2 sentences ONLY)
- image: Image blocks with src, alt, and caption
- button: Call-to-action buttons
- link: Text links with descriptions
- footer: Footer with company info, copyright, and social links

CRITICAL COPYWRITING RULES:
1. Hero heading: Lead with the #1 benefit (max 50 characters)
2. Hero subheading: 1-2 sentences explaining WHO it's for and WHAT problem it solves (max 120 characters)
3. Text block body: ALWAYS 1-2 sentences maximum (max 200 characters)
4. CTAs: Action-oriented, 2-3 words (e.g., "Get Started", "See Plans", "Join Free")
5. Benefits over features: Focus on what users GAIN, not what you offer
6. Conversational tone: Sound human, not corporate
7. Specific, not generic: Avoid vague words like "quality" or "excellence"
8. Each text block focuses on ONE clear benefit/feature

STRUCTURE RULES:
1. Return ONLY a valid JSON object with format: {"blocks": [...]}
2. NO markdown, NO code blocks, NO extra text - ONLY the raw JSON object
3. Each block must have: id (string), type (BlockType), order (number), content (object)
4. Generate 5-8 blocks total for a complete website
5. Always start with navbar (order: 0) and end with footer (last order)
6. For IDs, use format: "{type}-{timestamp}-{order}"
7. Make content SPECIFIC to the user's context, not generic templates

Example for "Modern coffee shop in downtown Portland":
{
  "blocks": [
    {
      "id": "navbar-1234567890-0",
      "type": "navbar",
      "order": 0,
      "content": {
        "brandName": "Brew & Co",
        "links": [
          {"text": "Menu", "url": "#menu"},
          {"text": "Visit", "url": "#location"},
          {"text": "Events", "url": "#events"}
        ]
      }
    },
    {
      "id": "hero-1234567890-1",
      "type": "hero",
      "order": 1,
      "content": {
        "heading": "Your Daily Dose of Portland",
        "subheading": "Locally roasted coffee and handcrafted pastries. Every morning, fresh.",
        "ctaText": "See Menu",
        "ctaLink": "#menu"
      }
    },
    {
      "id": "text-1234567890-2",
      "type": "text",
      "order": 2,
      "content": {
        "heading": "Roasted Here, Daily",
        "body": "We roast our beans in-house every morning for the freshest cup in town. Taste the difference quality makes."
      }
    }
  ]
}

BAD EXAMPLE (avoid this):
{
  "heading": "Welcome to Our Coffee Shop",
  "subheading": "We are a modern coffee establishment that provides high-quality beverages and food items to our valued customers in a comfortable atmosphere",
  "body": "Our coffee shop offers a wide variety of premium beverages including espresso-based drinks, pour-over coffee, cold brew, and specialty teas. We also feature an extensive selection of freshly baked pastries, sandwiches, and desserts made from the finest ingredients..."
}

Now generate a complete website structure for: "${contextPrompt}"

Remember: Every text block body must be 1-2 sentences ONLY. Be ruthlessly concise. Lead with benefits.

Return ONLY the JSON object with "blocks" array, nothing else.`;
}

/**
 * Validates the AI-generated block structure
 */
function validateBlock(block: unknown, index: number, timestamp: number): Block | null {
  if (typeof block !== 'object' || block === null) return null;

  const b = block as Record<string, unknown>;

  // Validate required fields
  if (!b.type || typeof b.type !== 'string') return null;
  if (!b.content || typeof b.content !== 'object') return null;

  const validTypes: BlockType[] = ['hero', 'text', 'image', 'button', 'link', 'navbar', 'footer'];
  if (!validTypes.includes(b.type as BlockType)) return null;

  // Generate proper ID and order
  const validatedBlock: Block = {
    id: `${b.type}-${timestamp}-${index}`,
    type: b.type as BlockType,
    order: index,
    content: b.content as Record<string, unknown>,
  } as Block;

  return validatedBlock;
}

/**
 * POST handler for Bento Build
 */
async function handlePOST(request: NextRequest): Promise<NextResponse<BentoBuildResponse>> {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'AI service is not configured. Please set OPENAI_API_KEY environment variable.',
        },
        { status: 500 }
      );
    }

    // Parse and validate request
    const body = await request.json();

    // Validate input with Zod schema
    const validation = validateInput(bentoBuildSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const { contextPrompt } = validation.data;

    // Sanitize context prompt to prevent prompt injection
    const sanitizedContextPrompt = sanitizeAIPrompt(contextPrompt);

    // Validate that sanitization didn't remove everything
    if (sanitizedContextPrompt.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid context prompt',
        },
        { status: 400 }
      );
    }

    // Build prompt with sanitized input
    const prompt = buildBentoBuildPrompt(sanitizedContextPrompt);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: CONTENT_GENERATION_CONFIG.model,
      temperature: 0.8, // Higher creativity for layout generation
      max_tokens: 2000, // More tokens for multiple blocks
      messages: [
        {
          role: 'system',
          content:
            'You are a professional web designer and copywriter specializing in high-converting websites. You create complete website structures with ultra-concise, benefit-focused copy. All body text is 1-2 sentences maximum. You focus on clear value propositions, conversational tone, and action-oriented CTAs. Never use generic corporate language. Generate complete website structures as JSON objects only - never include markdown code blocks or additional text, return only raw JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    // Extract response
    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('No content generated from OpenAI');
    }

    // Parse JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(rawContent);
    } catch {
      console.error('Failed to parse OpenAI response:', rawContent);
      throw new Error('Invalid JSON response from AI');
    }

    // Extract blocks array (handle different response formats)
    let blocksArray: unknown[];
    if (Array.isArray(parsedContent)) {
      blocksArray = parsedContent;
    } else if (parsedContent.blocks && Array.isArray(parsedContent.blocks)) {
      blocksArray = parsedContent.blocks;
    } else if (parsedContent.layout && Array.isArray(parsedContent.layout)) {
      blocksArray = parsedContent.layout;
    } else if (parsedContent.website && Array.isArray(parsedContent.website)) {
      blocksArray = parsedContent.website;
    } else if (parsedContent.structure && Array.isArray(parsedContent.structure)) {
      blocksArray = parsedContent.structure;
    } else {
      // Try to find any array in the response
      const values = Object.values(parsedContent);
      const arrayValue = values.find(val => Array.isArray(val));
      if (arrayValue && Array.isArray(arrayValue)) {
        blocksArray = arrayValue;
      } else {
        console.error('AI response format:', parsedContent);
        throw new Error('AI response does not contain a valid blocks array');
      }
    }

    // Validate and sanitize blocks
    const timestamp = Date.now();
    const validatedBlocks: Block[] = [];

    for (let i = 0; i < blocksArray.length; i++) {
      const block = validateBlock(blocksArray[i], i, timestamp);
      if (block) {
        validatedBlocks.push(block);
      }
    }

    if (validatedBlocks.length === 0) {
      throw new Error('No valid blocks were generated');
    }

    // Sanitize block content and fetch images
    const blocksWithImages = await Promise.all(
      validatedBlocks.map(async (block) => {
        // Sanitize content
        const sanitizedContent = sanitizeBlockContent(block.content);
        const sanitizedBlock = {
          ...block,
          content: sanitizedContent,
        } as Block;
        // Fetch image if needed
        if (sanitizedBlock.type === 'image' && (!sanitizedContent.src || (typeof sanitizedContent.src === 'string' && sanitizedContent.src.includes('placeholder')))) {
          try {
            const keywords = extractImageKeywords(sanitizedContextPrompt, 'image');
            const imageUrl = await getContextualImageUrl(keywords);
            return {
              ...sanitizedBlock,
              content: {
                ...sanitizedContent,
                src: imageUrl,
              },
            } as Block;
          } catch (error) {
            console.error('Failed to fetch image from Unsplash:', error);
            // Keep the placeholder or existing URL
          }
        }
        return sanitizedBlock;
      })
    );

    // Return successful response
    return NextResponse.json({
      success: true,
      blocks: blocksWithImages,
    });
  } catch (error) {
    console.error('Error in Bento Build:', error);

    // Handle different error types
    if (error instanceof Error) {
      // OpenAI API errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid API key configuration',
          },
          { status: 500 }
        );
      }

      // Rate limiting
      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          {
            success: false,
            error: 'AI service temporarily unavailable. Please try again later.',
          },
          { status: 429 }
        );
      }

      // Generic error
      return NextResponse.json(
        {
          success: false,
          error: `Failed to generate layout: ${error.message}`,
        },
        { status: 500 }
      );
    }

    // Unknown error
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// Export secured API handler with rate limiting
export const POST = secureApi(handlePOST, {
  rateLimit: 'ai', // 10 requests per minute for AI endpoints
  requireAuth: false, // Allow unauthenticated access for now
  logRequests: true,
});
