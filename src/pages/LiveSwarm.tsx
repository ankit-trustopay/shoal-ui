import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { EnterpriseLiveConsole } from '../components/swarm/live-console/EnterpriseLiveConsole';
import { API_BASE, type SwarmRecord } from '../lib/api';

function SwarmError({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl border-4 border-red-600 bg-red-50 px-8 py-10 text-red-900 text-xl md:text-2xl font-bold leading-relaxed"
      role="alert"
    >
      ERROR FETCHING SWARM: {message}
    </div>
  );
}

export function LiveSwarm() {
  const [searchParams] = useSearchParams();
  const swarmId = searchParams.get('swarmId');

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [swarm, setSwarm] = useState<SwarmRecord | null>(null);

  useEffect(() => {
    if (!swarmId) {
      setLoading(false);
      setFetchError('Missing swarmId in URL');
      setSwarm(null);
      return;
    }

    let cancelled = false;

    async function loadSwarm() {
      setLoading(true);
      setFetchError(null);
      setSwarm(null);

      console.log('Fetching swarm ID:', swarmId);

      try {
        const url = `${API_BASE}/api/swarms/${encodeURIComponent(swarmId)}`;
        const res = await fetch(url);

        if (!res.ok) {
          let errorBody = '';
          try {
            const json = (await res.json()) as { error?: string };
            errorBody = json.error ?? JSON.stringify(json);
          } catch {
            errorBody = await res.text().catch(() => res.statusText);
          }

          console.error(
            'Swarm fetch failed:',
            res.status,
            res.statusText,
            errorBody,
          );

          throw new Error(
            `HTTP ${res.status} ${res.statusText}${errorBody ? ` — ${errorBody}` : ''}`,
          );
        }

        const data = (await res.json()) as SwarmRecord;

        if (!data.premise) {
          throw new Error('Swarm data is missing premise');
        }

        if (!cancelled) {
          setSwarm(data);
        }
      } catch (err) {
        if (cancelled) return;

        console.error('Swarm fetch error:', err);
        setFetchError(
          err instanceof Error ? err.message : 'Unknown error loading swarm',
        );
        setSwarm(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSwarm();

    return () => {
      cancelled = true;
    };
  }, [swarmId]);

  const managerMessage = useMemo(() => {
    return swarm?.messages?.find((m) => m.role === 'Manager') ?? null;
  }, [swarm]);

  const debateMessages = useMemo(() => {
    return swarm?.messages?.filter((m) => m.role !== 'Manager') ?? [];
  }, [swarm]);

  if (!swarmId) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <SwarmError message="Missing swarmId in URL" />
      </PageContainer>
    );
  }

  if (fetchError) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <SwarmError message={fetchError} />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="full" className="py-6 md:py-10">
      <EnterpriseLiveConsole
        loading={loading}
        premise={swarm?.premise ?? null}
        managerText={managerMessage?.text ?? null}
        debateMessages={debateMessages}
      />
    </PageContainer>
  );
}
