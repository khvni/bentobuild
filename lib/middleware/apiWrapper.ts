/**
 * API Security Wrapper
 *
 * This module provides a secure wrapper for API route handlers that
 * automatically applies security measures including:
 * - Rate limiting
 * - Authentication checks
 * - Error handling
 * - Request logging
 *
 * Usage:
 * ```typescript
 * import { secureApi } from '@/lib/middleware/apiWrapper';
 *
 * export const POST = secureApi(
 *   async (req) => {
 *     // Your handler logic
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     rateLimit: 'ai',
 *     requireAuth: true,
 *   }
 * );
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, RateLimitType } from './rateLimit';
import { auth } from '@/lib/auth';

/**
 * API handler function type (simple routes without params)
 */
type ApiHandler = (
  req: NextRequest
) => Promise<NextResponse> | NextResponse;

/**
 * Security options for API wrapper
 */
interface SecurityOptions {
  /**
   * Type of rate limiting to apply
   * - 'ai': For AI endpoints (10 req/min)
   * - 'api': For general API (30 req/min)
   * - 'auth': For auth endpoints (5 req/5min)
   * - 'preview': For preview/deploy (5 req/min)
   * - false: Disable rate limiting
   */
  rateLimit?: RateLimitType | false;

  /**
   * Require authentication
   * If true, will return 401 for unauthenticated requests
   */
  requireAuth?: boolean;

  /**
   * Log requests
   * If true, logs request method, path, and timing
   */
  logRequests?: boolean;
}

/**
 * Secure API wrapper
 *
 * Wraps an API route handler with security middleware including
 * rate limiting, authentication, and error handling.
 *
 * @param handler - The API route handler function
 * @param options - Security options
 * @returns Wrapped handler with security measures applied
 *
 * @example
 * ```typescript
 * // AI endpoint with rate limiting and auth
 * export const POST = secureApi(
 *   async (req) => {
 *     const body = await req.json();
 *     // ... your logic
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     rateLimit: 'ai',
 *     requireAuth: true,
 *   }
 * );
 * ```
 */
export function secureApi(
  handler: ApiHandler,
  options: SecurityOptions = {}
): ApiHandler {
  const {
    rateLimit: rateLimitType = 'api',
    requireAuth = false,
    logRequests = true,
  } = options;

  return async (req: NextRequest) => {
    const startTime = Date.now();

    try {
      // Log request if enabled
      if (logRequests) {
        console.log(
          `[API] ${req.method} ${req.nextUrl.pathname} - Starting`
        );
      }

      // Apply rate limiting
      if (rateLimitType !== false) {
        const rateLimitResponse = await rateLimit(req, rateLimitType);
        if (rateLimitResponse) {
          if (logRequests) {
            console.log(
              `[API] ${req.method} ${req.nextUrl.pathname} - Rate limited`
            );
          }
          return rateLimitResponse;
        }
      }

      // Check authentication if required
      if (requireAuth) {
        const session = await auth();

        if (!session || !session.user) {
          if (logRequests) {
            console.log(
              `[API] ${req.method} ${req.nextUrl.pathname} - Unauthorized`
            );
          }
          return NextResponse.json(
            {
              success: false,
              error: 'Authentication required. Please sign in to continue.',
            },
            { status: 401 }
          );
        }

        // Attach session to request for use in handler
        // Note: This is done via closure, handler can call auth() again if needed
      }

      // Execute the handler
      const response = await handler(req);

      // Log successful completion
      if (logRequests) {
        const duration = Date.now() - startTime;
        console.log(
          `[API] ${req.method} ${req.nextUrl.pathname} - Completed in ${duration}ms`
        );
      }

      return response;
    } catch (error) {
      // Log error
      console.error(
        `[API] ${req.method} ${req.nextUrl.pathname} - Error:`,
        error
      );

      // Don't leak internal error details to clients in production
      const isDevelopment = process.env.NODE_ENV === 'development';
      const errorMessage = isDevelopment
        ? error instanceof Error
          ? error.message
          : 'An unexpected error occurred'
        : 'Internal server error';

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Get authenticated user session
 *
 * Helper function to get the current user session.
 * Returns null if user is not authenticated.
 *
 * @returns User session or null
 */
export async function getAuthUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Require authentication
 *
 * Helper function that throws an error if user is not authenticated.
 * Use this inside API handlers to ensure authentication.
 *
 * @throws {Error} If user is not authenticated
 * @returns User session
 *
 * @example
 * ```typescript
 * export const POST = secureApi(async (req) => {
 *   const user = await requireAuthUser();
 *   // user is guaranteed to exist here
 *   return NextResponse.json({ userId: user.id });
 * });
 * ```
 */
export async function requireAuthUser() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Authentication required');
  }

  return session.user;
}
