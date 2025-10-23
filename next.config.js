/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable font optimization during build to avoid network requests
  // Fonts will still load at runtime from Google Fonts CDN
  optimizeFonts: false,

  eslint: {
    // Don't fail build on ESLint errors during production builds
    // This allows deployment while we continue to fix linting issues
    ignoreDuringBuilds: false,
  },

  typescript: {
    // Don't fail build on TypeScript errors during development
    // Set to false for strict type checking
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
