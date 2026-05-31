import React from 'react';
import { Link } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { SparklesIcon } from 'lucide-react';
import { MonoLabel } from '../ui/MonoLabel';

export function AppSignInGate() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
            S
          </span>
          <span className="text-base font-bold text-black tracking-tight">Shoal AI</span>
        </Link>
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          Back to marketing site
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <SparklesIcon size={24} aria-hidden />
            </div>
            <MonoLabel className="mb-3 block tracking-[0.2em]">Console access</MonoLabel>
            <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-2">
              Sign in to your swarm console
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              Run adversarial swarms, review history, and manage credits from one
              secure workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-1 shadow-bento overflow-hidden">
            <SignIn
              routing="hash"
              signUpUrl="/signup"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none border-0 rounded-xl',
                  headerTitle: 'text-lg font-bold text-black',
                  headerSubtitle: 'text-gray-500',
                  formButtonPrimary:
                    'bg-gray-900 hover:bg-black text-sm font-semibold',
                  footerActionLink: 'text-orange-600 hover:text-orange-700',
                },
              }}
            />
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            New to Shoal?{' '}
            <Link to="/signup" className="font-semibold text-orange-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
