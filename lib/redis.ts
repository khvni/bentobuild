/**
 * Upstash Redis Client Configuration
 *
 * This module initializes and exports the Upstash Redis client used for
 * rate limiting and caching across the application.
 *
 * Environment Variables Required:
 * - UPSTASH_REDIS_REST_URL: The REST URL for your Upstash Redis instance
 * - UPSTASH_REDIS_REST_TOKEN: The authentication token for your Upstash Redis instance
 *
 * @see https://upstash.com/docs/redis/overall/getstarted
 */

import { Redis } from '@upstash/redis';

/**
 * Redis client instance
 *
 * This client is used by the rate limiting middleware to track and enforce
 * request limits across the application. It connects to Upstash Redis using
 * REST API, making it suitable for serverless environments.
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Check if Redis is properly configured
 *
 * @returns True if Redis environment variables are set
 */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Get a Redis client instance or null if not configured
 *
 * This is useful for optional Redis features that can gracefully
 * degrade if Redis is not available.
 */
export function getRedisClient(): Redis | null {
  return isRedisConfigured() ? redis : null;
}
