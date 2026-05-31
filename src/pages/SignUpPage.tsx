import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { AuthPageLayout } from '../components/auth/AuthPageLayout';
import { clerkAuthAppearance } from '../components/auth/clerkAppearance';

export function SignUpPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/app/new" replace />
      </SignedIn>
      <SignedOut>
        <AuthPageLayout
          title="Create your account"
          subtitle="Start dispatching swarms in under a minute."
          alternatePrompt="Have an account?"
          alternateLabel="Sign in"
          alternateTo="/sign-in"
        >
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/app/new"
            appearance={clerkAuthAppearance}
          />
        </AuthPageLayout>
      </SignedOut>
    </>
  );
}
