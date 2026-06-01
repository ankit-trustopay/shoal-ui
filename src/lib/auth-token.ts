/**
 * Clerk session token bridge for non-React API modules.
 * Registered by ClerkAuthBridge via useAuth().getToken().
 */

export type AuthTokenGetter = () => Promise<string | null>;

let authTokenGetter: AuthTokenGetter | null = null;

export function registerAuthTokenGetter(getter: AuthTokenGetter | null): void {
  authTokenGetter = getter;
}

export async function resolveAuthToken(): Promise<string | null> {
  if (authTokenGetter) {
    try {
      return await authTokenGetter();
    } catch (error) {
      console.warn('[auth-token] getToken() failed:', error);
      return null;
    }
  }

  try {
    return (await window.Clerk?.session?.getToken()) ?? null;
  } catch {
    return null;
  }
}
