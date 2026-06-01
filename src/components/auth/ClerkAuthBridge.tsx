import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { registerAuthTokenGetter } from '../../lib/auth-token';

/**
 * Wires Clerk's getToken() into fetch helpers so API calls send
 * Authorization: Bearer <session_jwt>.
 */
export function ClerkAuthBridge() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    registerAuthTokenGetter(async () => {
      if (!isLoaded || !isSignedIn) {
        return null;
      }
      return getToken();
    });

    return () => {
      registerAuthTokenGetter(null);
    };
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}
