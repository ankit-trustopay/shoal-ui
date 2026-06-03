import { useEffect, useMemo, useState } from 'react';
import { getDebate, type SwarmRecord, type SwarmStatus } from '../lib/api';
import {
  isDebateCompleted,
  isDebateFailed,
  normalizeDebateStatus,
} from '../lib/debateStatus';

const POLL_INTERVAL_MS = 3000;

type DebatePollingResult = {
  debate: SwarmRecord | null;
  loading: boolean;
  error: string | null;
  status: SwarmRecord['status'] | null;
  isPolling: boolean;
};

function resolveTerminalStatus(
  record: SwarmRecord,
): 'COMPLETED' | 'FAILED' | null {
  if (isDebateFailed(record.status)) {
    return 'FAILED';
  }
  if (isDebateCompleted(record.status, record.resultData)) {
    return 'COMPLETED';
  }
  return null;
}

function isActiveDebateStatus(status: SwarmStatus | null): boolean {
  return status === 'PENDING' || status === 'RUNNING';
}

export function useDebatePolling(debateId: string | null): DebatePollingResult {
  const [debate, setDebate] = useState<SwarmRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!debateId) {
      setDebate(null);
      setLoading(false);
      setIsPolling(false);
      setError('Missing debate id');
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const stopPolling = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      setIsPolling(false);
    };

    async function pollOnce(): Promise<'COMPLETED' | 'FAILED' | 'ACTIVE' | null> {
      const data = await getDebate(debateId);
      if (cancelled) return null;

      setDebate(data);
      setError(null);
      setLoading(false);

      const terminal = resolveTerminalStatus(data);
      const normalized = normalizeDebateStatus(data.status);

      console.log('[useDebatePolling] fetched', {
        debateId,
        status: data.status,
        normalized,
        terminal,
        hasResultData: Boolean(data.resultData),
      });

      if (terminal === 'COMPLETED' || terminal === 'FAILED') {
        stopPolling();
        return terminal;
      }

      if (isActiveDebateStatus(normalized)) {
        return 'ACTIVE';
      }

      return 'ACTIVE';
    }

    async function startPolling() {
      setIsPolling(true);

      try {
        const first = await pollOnce();
        if (cancelled) return;
        if (first === 'COMPLETED' || first === 'FAILED') {
          return;
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load debate';
        console.error('[useDebatePolling] error', { debateId, message });
        setError(message);
        setLoading(false);
      }

      if (cancelled) return;

      intervalId = window.setInterval(() => {
        void (async () => {
          try {
            const outcome = await pollOnce();
            if (outcome === 'COMPLETED' || outcome === 'FAILED') {
              stopPolling();
            }
          } catch (err) {
            if (cancelled) return;
            const message =
              err instanceof Error ? err.message : 'Failed to load debate';
            console.error('[useDebatePolling] poll error', { debateId, message });
            setError(message);
          }
        })();
      }, POLL_INTERVAL_MS);
    }

    void startPolling();

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [debateId]);

  return useMemo(
    () => ({
      debate,
      loading,
      error,
      status: debate?.status ?? null,
      isPolling,
    }),
    [debate, loading, error, isPolling],
  );
}
