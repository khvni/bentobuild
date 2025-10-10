import { NextResponse } from 'next/server';

/**
 * Debug endpoint to check environment variable status
 *
 * SECURITY NOTE: This endpoint is ONLY available in development mode.
 * It will NOT work in production to prevent exposing sensitive information.
 *
 * Usage:
 *   GET /api/debug-env
 *
 * Response includes:
 *   - Whether each required env var is present
 *   - Length of each env var (not the actual value)
 *   - First 8 characters of each key (safe for debugging)
 *   - Runtime environment info
 */
export async function GET() {
  // SECURITY: Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      {
        success: false,
        error: 'This endpoint is only available in development mode',
      },
      { status: 403 }
    );
  }

  console.log('=== Debug Environment Check ===');
  console.log('Timestamp:', new Date().toISOString());

  // Check all environment variables (without exposing actual values)
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    platform: process.platform,
    nodeVersion: process.version,

    environmentVariables: {
      OPENAI_API_KEY: {
        present: !!process.env.OPENAI_API_KEY,
        length: process.env.OPENAI_API_KEY?.length || 0,
        prefix: process.env.OPENAI_API_KEY
          ? `${process.env.OPENAI_API_KEY.substring(0, 8)}...`
          : 'N/A',
      },
      DAYTONA_API_KEY: {
        present: !!process.env.DAYTONA_API_KEY,
        length: process.env.DAYTONA_API_KEY?.length || 0,
        prefix: process.env.DAYTONA_API_KEY
          ? `${process.env.DAYTONA_API_KEY.substring(0, 8)}...`
          : 'N/A',
      },
      UNSPLASH_ACCESS_KEY: {
        present: !!process.env.UNSPLASH_ACCESS_KEY,
        length: process.env.UNSPLASH_ACCESS_KEY?.length || 0,
        prefix: process.env.UNSPLASH_ACCESS_KEY
          ? `${process.env.UNSPLASH_ACCESS_KEY.substring(0, 8)}...`
          : 'N/A',
      },
    },

    vercelInfo: {
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV || 'N/A',
      vercelUrl: process.env.VERCEL_URL ? 'Present' : 'N/A',
    },

    recommendations: [] as Array<{ key: string; message: string }>,
  };

  // Add recommendations based on missing env vars
  if (!envCheck.environmentVariables.OPENAI_API_KEY.present) {
    envCheck.recommendations.push({
      key: 'OPENAI_API_KEY',
      message: 'Required for AI content generation. Get it from https://platform.openai.com/api-keys',
    });
  }

  if (!envCheck.environmentVariables.DAYTONA_API_KEY.present) {
    envCheck.recommendations.push({
      key: 'DAYTONA_API_KEY',
      message: 'Required for live preview deployment. Get it from https://www.daytona.io/dashboard. Preview will run in mock mode without it.',
    });
  }

  if (!envCheck.environmentVariables.UNSPLASH_ACCESS_KEY.present) {
    envCheck.recommendations.push({
      key: 'UNSPLASH_ACCESS_KEY',
      message: 'Optional for better image suggestions. Get it from https://unsplash.com/developers. Falls back to Picsum Photos without it.',
    });
  }

  console.log('Environment check results:', JSON.stringify(envCheck, null, 2));
  console.log('================================');

  return NextResponse.json({
    success: true,
    data: envCheck,
  });
}
