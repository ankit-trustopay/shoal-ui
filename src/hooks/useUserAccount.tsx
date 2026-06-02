import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { SaasPlanId } from '../data/creditsBilling';
import { getUserAccount, type UserAccount } from '../lib/api';
import { normalizePlanId } from '../lib/planLabels';

interface UserAccountContextValue {
  /** Wallet record from GET /api/user/me */
  user: UserAccount | null;
  account: UserAccount | null;
  totalCredits: number;
  dailyCredits: number;
  vaultCredits: number;
  /** @deprecated Prefer totalCredits/dailyCredits/vaultCredits */
  credits: number;
  plan: string;
  planId: SaasPlanId;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const UserAccountContext = createContext<UserAccountContextValue | null>(null);

const WALLET_ERROR_MESSAGE = 'Failed to load wallet. Please refresh.';

export function UserAccountProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setAccount(null);
      setError('Sign in required');
      setFetching(false);
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const data = await getUserAccount({ getToken });
      setAccount(data);
    } catch (err) {
      setAccount(null);
      const message =
        err instanceof Error && err.message.trim()
          ? err.message
          : WALLET_ERROR_MESSAGE;
      setError(message);
    } finally {
      setFetching(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    void refresh();
  }, [isLoaded, refresh]);

  const loading = !isLoaded || fetching;

  const value = useMemo<UserAccountContextValue>(() => {
    const user = account;
    const totalCredits = (user?.dailyCredits || 0) + (user?.vaultCredits || 0);

    return {
      user,
      account: user,
      dailyCredits: user?.dailyCredits || 0,
      vaultCredits: user?.vaultCredits || 0,
      totalCredits,
      credits: totalCredits,
      plan: user?.plan ?? 'FREE',
      planId: normalizePlanId(user?.plan ?? 'FREE'),
      loading,
      error,
      refresh,
    };
  }, [account, loading, error, refresh]);

  return (
    <UserAccountContext.Provider value={value}>{children}</UserAccountContext.Provider>
  );
}

export function useUserAccount(): UserAccountContextValue {
  const context = useContext(UserAccountContext);
  if (!context) {
    throw new Error('useUserAccount must be used within UserAccountProvider');
  }
  return context;
}
