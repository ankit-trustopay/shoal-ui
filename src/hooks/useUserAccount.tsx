import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { SaasPlanId } from '../data/creditsBilling';
import { getUserAccount, type UserAccount } from '../lib/api';
import { normalizePlanId } from '../lib/planLabels';

interface UserAccountContextValue {
  account: UserAccount | null;
  credits: number;
  plan: string;
  planId: SaasPlanId;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const UserAccountContext = createContext<UserAccountContextValue | null>(null);

export function UserAccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUserAccount();
      setAccount(data);
    } catch (err) {
      setAccount(null);
      setError(err instanceof Error ? err.message : 'Failed to load account');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<UserAccountContextValue>(
    () => ({
      account,
      credits: account?.credits ?? 0,
      plan: account?.plan ?? 'FREE',
      planId: normalizePlanId(account?.plan ?? 'FREE'),
      loading,
      error,
      refresh,
    }),
    [account, loading, error, refresh],
  );

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
