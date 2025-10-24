import { auth } from './auth';
import { redirect } from 'next/navigation';

/**
 * Require authentication for a page or API route.
 * Redirects to sign-in page if user is not authenticated.
 * @returns The authenticated session
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  return session;
}

/**
 * Get the current authenticated user.
 * Returns null if user is not authenticated.
 * @returns The current user or null
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
