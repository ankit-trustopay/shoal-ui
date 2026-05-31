import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { AuthPageLayout } from '../components/auth/AuthPageLayout';
import { clerkAuthAppearance } from '../components/auth/clerkAppearance';

export function SignInPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/app/new" replace />
      </SignedIn>
      <SignedOut>
        <AuthPageLayout
          title="Welcome back"
          subtitle="Sign in to dispatch your next swarm."
          alternatePrompt="New here?"
          alternateLabel="Create an account"
          alternateTo="/sign-up"
        >
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/app/new"
            appearance={clerkAuthAppearance}
          />
        </AuthPageLayout>
      </SignedOut>
    </>
  );
}
