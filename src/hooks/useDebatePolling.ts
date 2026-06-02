import { useEffect, useMemo, useState } from 'react';
import { getDebate, type SwarmRecord } from '../lib/api';
import { normalizeDebateStatus } from '../lib/debateStatus';

type DebatePollingResult = {
  debate: SwarmRecord | null;
  loading: boolean;
  error: string | null;
  status: SwarmRecord['status'] | null;
};

export function useDebatePolling(debateId: string | null): DebatePollingResult {
  const [debate, setDebate] = useState<SwarmRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debateId) {
      setDebate(null);
      setLoading(false);
      setError('Missing debate id');
      return;
    }

    let cancelled = false;
    let intervalId: number | null = null;

    async function loadOnce() {
      try {
        const data = await getDebate(debateId);
        if (cancelled) return;

        console.log('[useDebatePolling] fetched', {
          debateId,
          status: data.status,
          normalized: normalizeDebateStatus(data.status),
          confidence: data.confidence,
          hasResultData: Boolean(data.resultData),
        });

        setDebate(data);
        setError(null);

        const normalized = normalizeDebateStatus(data.status);
        if (normalized === 'COMPLETED' || normalized === 'FAILED') {
          if (intervalId) window.clearInterval(intervalId);
          intervalId = null;
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load debate';
        console.error('[useDebatePolling] error', { debateId, message });
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOnce();
    intervalId = window.setInterval(loadOnce, 3000);

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [debateId]);

  return useMemo(
    () => ({
      debate,
      loading,
      error,
      status: debate?.status ?? null,
    }),
    [debate, loading, error],
  );
}
