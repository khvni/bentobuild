/**
 * Rate Limiting Middleware
 *
 * This module provides rate limiting functionality using Upstash Redis.
 * It implements different rate limits for different types of API endpoints
 * to prevent abuse and ensure fair usage.
 *
 * Rate Limiting Tiers:
 * - AI endpoints: 10 requests per minute (expensive operations)
 * - API endpoints: 30 requests per minute (general API usage)
 * - Auth endpoints: 5 requests per 5 minutes (prevent brute force)
 *
 * @see https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

import { Ratelimit } from '@upstash/ratelimit';
import { redis, isRedisConfigured } from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limiter instances for different endpoint types
 *
 * Each limiter uses a sliding window algorithm to ensure smooth
 * distribution of requests over time.
 */
const rateLimiters = {
  /**
   * AI endpoints (e.g., content generation, Bento Build)
   * 10 requests per 60 seconds
   */
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    analytics: true,
    prefix: 'ratelimit:ai',
  }),

  /**
   * General API endpoints
   * 30 requests per 60 seconds
   */
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),

  /**
   * Authentication endpoints (login, register, password reset)
   * 5 requests per 300 seconds (5 minutes)
   */
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '300 s'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),

  /**
   * Preview/deployment endpoints
   * 5 requests per 60 seconds (these can be expensive)
   */
  preview: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    analytics: true,
    prefix: 'ratelimit:preview',
  }),
};

/**
 * Rate limit types
 */
export type RateLimitType = keyof typeof rateLimiters;

/**
 * Apply rate limiting to an API request
 *
 * This function checks if the request has exceeded the rate limit
 * and returns a 429 response if so. Otherwise, it returns null
 * to allow the request to proceed.
 *
 * @param request - The incoming Next.js request
 * @param type - The type of rate limit to apply
 * @returns NextResponse with 429 status if rate limited, null otherwise
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const rateLimitResponse = await rateLimit(request, 'ai');
 *   if (rateLimitResponse) return rateLimitResponse;
 *
 *   // Continue with request handling...
 * }
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  type: RateLimitType = 'api'
): Promise<NextResponse | null> {
  // Skip rate limiting if Redis is not configured (development mode)
  if (!isRedisConfigured()) {
    console.warn(
      '[Rate Limit] Redis not configured - rate limiting is disabled'
    );
    return null;
  }

  try {
    // Get client identifier (IP address)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') || // Cloudflare
      'anonymous';

    // Create unique identifier combining IP and endpoint
    const identifier = `${ip}:${request.nextUrl.pathname}`;

    // Check rate limit
    const { success, limit, reset } =
      await rateLimiters[type].limit(identifier);

    // If rate limit exceeded, return 429 response
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    // Rate limit check passed - allow request to proceed
    return null;
  } catch (error) {
    // If rate limiting fails, log the error but allow the request
    // This ensures the API remains functional even if Redis is down
    console.error('[Rate Limit] Error checking rate limit:', error);
    return null;
  }
}

/**
 * Get remaining rate limit info for a request
 *
 * Useful for displaying rate limit status to users or in API responses.
 *
 * @param request - The incoming Next.js request
 * @param type - The type of rate limit to check
 * @returns Rate limit information or null if Redis not configured
 */
export async function getRateLimitInfo(
  request: NextRequest,
  type: RateLimitType = 'api'
): Promise<{
  limit: number;
  remaining: number;
  reset: number;
} | null> {
  if (!isRedisConfigured()) {
    return null;
  }

  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    const identifier = `${ip}:${request.nextUrl.pathname}`;
    const { limit, remaining, reset } = await rateLimiters[type].limit(
      identifier
    );

    return { limit, remaining, reset };
  } catch (error) {
    console.error('[Rate Limit] Error getting rate limit info:', error);
    return null;
  }
}
