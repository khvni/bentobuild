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
