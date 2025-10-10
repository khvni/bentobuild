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
  return `You are an expert web designer creating a complete website structure.

User's website context: "${contextPrompt}"

Based on this context, generate a complete website layout. Return ONLY a JSON object with a "blocks" array.

Available block types:
- navbar: Navigation bar with brand name and links
- hero: Main hero section with heading, subheading, and CTA
- text: Text content sections with heading and body
- image: Image blocks with src, alt, and caption
- button: Call-to-action buttons
- link: Text links with descriptions
- footer: Footer with company info, copyright, and social links

IMPORTANT RULES:
1. Return ONLY a valid JSON object with format: {"blocks": [...]}
2. NO markdown, NO code blocks, NO extra text - ONLY the raw JSON object
3. Each block must have: id (string), type (BlockType), order (number), content (object)
4. Generate 5-8 blocks total for a complete website
5. Always start with navbar (order: 0) and end with footer (last order)
6. Content must be contextually relevant and professional
7. For IDs, use format: "{type}-{timestamp}-{order}"
8. Make content specific to the user's context, not generic

Example structure for a photographer:
{
  "blocks": [
    {
    "id": "navbar-1234567890-0",
    "type": "navbar",
    "order": 0,
    "content": {
      "brandName": "John Doe Photography",
      "links": [
        {"text": "Home", "url": "#"},
        {"text": "Portfolio", "url": "#portfolio"},
        {"text": "About", "url": "#about"},
        {"text": "Contact", "url": "#contact"}
      ]
    }
  },
  {
    "id": "hero-1234567890-1",
    "type": "hero",
    "order": 1,
    "content": {
      "heading": "Capturing Nature's Beauty",
      "subheading": "Professional landscape photography services for your brand",
      "ctaText": "View Portfolio",
      "ctaLink": "#portfolio"
    }
  }
  ]
}

Now generate a complete website structure for: "${contextPrompt}"

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
export async function POST(request: NextRequest): Promise<NextResponse<BentoBuildResponse>> {
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
    const { contextPrompt } = body as BentoBuildRequest;

    if (!contextPrompt || typeof contextPrompt !== 'string' || contextPrompt.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: "contextPrompt" is required and must be a non-empty string',
        },
        { status: 400 }
      );
    }

    // Build prompt
    const prompt = buildBentoBuildPrompt(contextPrompt.trim());

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: CONTENT_GENERATION_CONFIG.model,
      temperature: 0.8, // Higher creativity for layout generation
      max_tokens: 2000, // More tokens for multiple blocks
      messages: [
        {
          role: 'system',
          content:
            'You are a professional web designer. Generate complete website structures as JSON arrays only. Never include markdown code blocks or additional text - return only raw JSON arrays.',
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

    // Fetch images for image blocks using Unsplash
    const blocksWithImages = await Promise.all(
      validatedBlocks.map(async (block) => {
        if (block.type === 'image' && (!block.content.src || block.content.src.includes('placeholder'))) {
          try {
            const keywords = extractImageKeywords(contextPrompt, 'image');
            const imageUrl = await getContextualImageUrl(keywords);
            return {
              ...block,
              content: {
                ...block.content,
                src: imageUrl,
              },
            };
          } catch (error) {
            console.error('Failed to fetch image from Unsplash:', error);
            // Keep the placeholder or existing URL
            return block;
          }
        }
        return block;
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
