/**
 * Generate Block Content API Endpoint
 *
 * This endpoint generates AI-powered content for web page blocks using OpenAI.
 *
 * @route POST /api/generate-block-content
 *
 * @body {
 *   context: string - Global site context describing the website/business
 *   blockType: string - Type of block (e.g., "hero", "about", "features", "testimonial")
 *   existingFields?: object - Optional current field values to refine/improve
 * }
 *
 * @returns {
 *   success: boolean,
 *   content?: {
 *     title?: string,
 *     body?: string,
 *     cta?: string,
 *     imageUrl?: string,
 *     [key: string]: any
 *   },
 *   error?: string
 * }
 *
 * @example
 * POST /api/generate-block-content
 * {
 *   "context": "A modern fitness studio offering yoga and pilates classes",
 *   "blockType": "hero",
 *   "existingFields": {}
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "content": {
 *     "title": "Transform Your Body and Mind",
 *     "body": "Join our expert-led yoga and pilates classes...",
 *     "cta": "Start Your Journey"
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { openai, CONTENT_GENERATION_CONFIG } from '@/lib/openai';

// Type definitions
interface GenerateBlockContentRequest {
  context: string;
  blockType: string;
  existingFields?: Record<string, any>;
}

interface BlockContent {
  title?: string;
  body?: string;
  cta?: string;
  imageUrl?: string;
  [key: string]: any;
}

/**
 * Builds a structured prompt for OpenAI based on block type and context
 */
function buildPrompt(
  blockType: string,
  context: string,
  existingFields?: Record<string, any>
): string {
  const basePrompt = `You are generating web copy for a ${blockType} section.

User context: ${context}

${existingFields && Object.keys(existingFields).length > 0 ? `Existing content to refine:\n${JSON.stringify(existingFields, null, 2)}\n` : ''}

Generate concise, natural, and engaging content appropriate for a ${blockType} section.

IMPORTANT: Return ONLY valid JSON with no additional text, markdown, or code blocks.

The JSON should include relevant fields from the following options based on the block type:
- title: A compelling headline (max 80 characters)
- body: Supporting text or description (max 200 characters for concise blocks, max 500 for content-heavy blocks)
- cta: Call-to-action text (max 30 characters)
- imageUrl: Suggest a descriptive image placeholder URL using https://via.placeholder.com/WIDTHxHEIGHT (optional)

Ensure all text is professional, engaging, and tailored to the context provided.`;

  return basePrompt;
}

/**
 * Validates and sanitizes the AI-generated response
 */
function validateAndSanitizeResponse(data: any): BlockContent {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid response format: expected JSON object');
  }

  const sanitized: BlockContent = {};

  // Validate and sanitize title
  if (data.title && typeof data.title === 'string') {
    sanitized.title = data.title.trim().slice(0, 200);
  }

  // Validate and sanitize body
  if (data.body && typeof data.body === 'string') {
    sanitized.body = data.body.trim().slice(0, 1000);
  }

  // Validate and sanitize CTA
  if (data.cta && typeof data.cta === 'string') {
    sanitized.cta = data.cta.trim().slice(0, 50);
  }

  // Validate and sanitize image URL
  if (data.imageUrl && typeof data.imageUrl === 'string') {
    const urlPattern = /^https?:\/\/.+/;
    if (urlPattern.test(data.imageUrl)) {
      sanitized.imageUrl = data.imageUrl.trim();
    }
  }

  // Include any other string fields that might be present
  for (const [key, value] of Object.entries(data)) {
    if (
      !['title', 'body', 'cta', 'imageUrl'].includes(key) &&
      typeof value === 'string'
    ) {
      sanitized[key] = (value as string).trim().slice(0, 500);
    }
  }

  return sanitized;
}

/**
 * POST handler for generating block content
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const { context, blockType, existingFields } = body as GenerateBlockContentRequest;

    if (!context || typeof context !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: "context" is required and must be a string',
        },
        { status: 400 }
      );
    }

    if (!blockType || typeof blockType !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: "blockType" is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Build the prompt
    const prompt = buildPrompt(blockType, context, existingFields);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: CONTENT_GENERATION_CONFIG.model,
      temperature: CONTENT_GENERATION_CONFIG.temperature,
      max_tokens: CONTENT_GENERATION_CONFIG.max_tokens,
      messages: [
        {
          role: 'system',
          content:
            'You are a professional web copywriter. Generate concise, engaging content in JSON format only. Never include markdown code blocks or additional text - return only raw JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' }, // Ensure JSON response
    });

    // Extract the generated content
    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('No content generated from OpenAI');
    }

    // Parse and validate JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', rawContent);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate and sanitize the response
    const sanitizedContent = validateAndSanitizeResponse(parsedContent);

    // Return successful response
    return NextResponse.json({
      success: true,
      content: sanitizedContent,
    });
  } catch (error) {
    console.error('Error generating block content:', error);

    // Handle different types of errors
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

      // Rate limiting or quota errors
      if (error.message.includes('rate') || error.message.includes('quota')) {
        return NextResponse.json(
          {
            success: false,
            error: 'AI service temporarily unavailable. Please try again later.',
          },
          { status: 429 }
        );
      }

      // Generic error response
      return NextResponse.json(
        {
          success: false,
          error: `Failed to generate content: ${error.message}`,
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
