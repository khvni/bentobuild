/**
 * API endpoint constants
 * Centralized API routes to avoid hardcoded strings throughout the application
 */

export const API_ENDPOINTS = {
  GENERATE_BLOCK_CONTENT: '/api/generate-block-content',
  BENTO_BUILD: '/api/bento-build',
  PREVIEW: '/api/preview',
} as const;

/**
 * API request methods
 */
export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

/**
 * API response status codes
 */
export const API_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * External API endpoints
 */
export const EXTERNAL_APIS = {
  UNSPLASH_API: 'https://api.unsplash.com',
  UNSPLASH_SEARCH: 'https://api.unsplash.com/search/photos',
  UNSPLASH_RANDOM: 'https://api.unsplash.com/photos/random',
  PICSUM_PLACEHOLDER: 'https://picsum.photos',
} as const;
