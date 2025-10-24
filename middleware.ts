import { auth } from '@/lib/auth';

export default auth((req) => {
  // Add custom middleware logic here if needed
  // For now, just using the auth middleware to protect routes
});

export const config = {
  matcher: ['/api/projects/:path*'],
};
