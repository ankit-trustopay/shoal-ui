import { useCallback, useEffect, useRef, useState } from 'react';
import { getSwarm, type SwarmRecord } from '../lib/api';
import { isSwarmProcessing } from '../lib/swarmReady';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_MS = 120_000;

export function useSwarmPolling(swarmId: string | null) {
  const [swarm, setSwarm] = useState<SwarmRecord | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  const fetchLatest = useCallback(async (): Promise<SwarmRecord | null> => {
    if (!swarmId) return null;

    const data = await getSwarm(swarmId);
    setSwarm(data);
    return data;
  }, [swarmId]);

  useEffect(() => {
    if (!swarmId) {
      setInitialLoading(false);
      setFetchError('Missing swarmId in URL');
      setSwarm(null);
      setIsPolling(false);
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    startedAtRef.current = Date.now();

    async function pollOnce(): Promise<void> {
      try {
        const data = await fetchLatest();
        if (cancelled || !data) return;

        setFetchError(null);

        if (isSwarmProcessing(data)) {
          setIsPolling(true);
          return;
        }

        setIsPolling(false);
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Swarm poll error:', err);
        setFetchError(
          err instanceof Error ? err.message : 'Unknown error loading swarm',
        );
        setIsPolling(false);
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
        }
      }
    }

    void pollOnce();

    intervalId = setInterval(() => {
      if (Date.now() - startedAtRef.current > MAX_POLL_MS) {
        clearInterval(intervalId);
        setIsPolling(false);
        setFetchError(
          'Swarm deliberation is taking longer than expected. Please refresh in a moment.',
        );
        setInitialLoading(false);
        return;
      }

      void pollOnce();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [swarmId, fetchLatest]);

  return {
    swarm,
    initialLoading,
    isPolling,
    fetchError,
  };
}
