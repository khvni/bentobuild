'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Github } from 'lucide-react';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  const handleSignIn = (provider: 'github' | 'google') => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bauhaus-yellow/10 via-white to-bauhaus-blue/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Bauhaus geometric decorations */}
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-bauhaus-red rounded-full opacity-20"></div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-bauhaus-blue rounded-bauhaus-sm opacity-20"></div>
        <div className="absolute top-1/2 -right-8 w-12 h-12 bg-bauhaus-yellow opacity-30 rotate-45"></div>

        {/* Main sign-in card */}
        <div className="bg-white border-2 border-black rounded-bauhaus-lg shadow-bauhaus-xl p-8 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue"></div>

          {/* Logo/Title section */}
          <div className="text-center mb-8 mt-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-bauhaus-blue border-2 border-black rounded-bauhaus-md shadow-bauhaus-md flex items-center justify-center">
                <span className="text-2xl font-bold text-white">BB</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black uppercase tracking-wide mb-2">
              Bentoblocks
            </h1>
            <p className="text-sm text-gray-600 font-semibold">
              AI-Powered Website Builder
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-bauhaus-red rounded-bauhaus-md">
              <p className="text-sm text-red-600 font-bold text-center">
                {error === 'OAuthAccountNotLinked'
                  ? 'This email is already associated with another account.'
                  : 'An error occurred during sign in. Please try again.'}
              </p>
            </div>
          )}

          {/* Sign-in message */}
          <div className="mb-6 text-center">
            <p className="text-gray-700 font-semibold">
              Sign in to save and manage your projects
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* GitHub Sign In */}
            <button
              onClick={() => handleSignIn('github')}
              className="w-full bg-black text-white px-6 py-4 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 border-black shadow-bauhaus-md hover:shadow-bauhaus-lg bauhaus-transition active:scale-95 flex items-center justify-center gap-3"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>

            {/* Google Sign In */}
            <button
              onClick={() => handleSignIn('google')}
              className="w-full bg-white text-black px-6 py-4 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 border-black shadow-bauhaus-md hover:shadow-bauhaus-lg bauhaus-transition active:scale-95 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              Your projects are stored securely and are only accessible to you.
            </p>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-bauhaus-red rounded-full"></div>
          <div className="w-3 h-3 bg-bauhaus-yellow rounded-full"></div>
          <div className="w-3 h-3 bg-bauhaus-blue rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
