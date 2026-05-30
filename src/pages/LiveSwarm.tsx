import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { SwarmSessionHeader } from '../components/swarm/SwarmSessionHeader';
import { SwarmOverviewSidebar } from '../components/swarm/SwarmOverviewSidebar';
import { AgentFeed } from '../components/swarm/AgentFeed';
import { SwarmTelemetryPanel } from '../components/swarm/SwarmTelemetryPanel';
import { API_BASE, type SwarmRecord } from '../lib/api';
import {
  LIVE_SESSION,
  activePersonas,
  debateMessages,
  swarmTelemetry,
} from '../data/liveSwarm';

function SwarmError({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl border-4 border-red-600 bg-red-50 px-8 py-10 text-red-900 text-xl md:text-2xl font-bold leading-relaxed"
      role="alert">
      ERROR FETCHING SWARM: {message}
    </div>
  );
}

export function LiveSwarm() {
  const [searchParams] = useSearchParams();
  const swarmId = searchParams.get('swarmId');

  const [premise, setPremise] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!swarmId) {
      setLoading(false);
      setFetchError('Missing swarmId in URL');
      setPremise(null);
      setSessionId(null);
      return;
    }

    let cancelled = false;

    async function loadSwarm() {
      setLoading(true);
      setFetchError(null);
      setPremise(null);
      setSessionId(swarmId);

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
            errorBody
          );

          throw new Error(
            `HTTP ${res.status} ${res.statusText}${errorBody ? ` — ${errorBody}` : ''}`
          );
        }

        const swarm = (await res.json()) as SwarmRecord;

        if (!swarm.premise) {
          console.error('Swarm fetch returned incomplete data:', swarm);
          throw new Error('Swarm data is missing premise');
        }

        if (cancelled) return;

        setPremise(swarm.premise);
        setSessionId(swarm.id);
      } catch (err) {
        if (cancelled) return;

        console.error('Swarm fetch error:', err);

        const message =
          err instanceof Error ? err.message : 'Unknown error loading swarm';

        setFetchError(message);
        setPremise(null);
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

  if (loading) {
    return (
      <PageContainer width="full" className="py-6 md:py-8">
        <SwarmSessionHeader
          sessionId={swarmId ?? '—'}
          title="Loading your swarm data..."
        />
      </PageContainer>
    );
  }

  if (fetchError) {
    return (
      <PageContainer width="full" className="py-6 md:py-8">
        <SwarmSessionHeader
          sessionId={swarmId ?? '—'}
          title="Swarm session"
        />
        <SwarmError message={fetchError} />
      </PageContainer>
    );
  }

  if (!premise || !sessionId) {
    return (
      <PageContainer width="full" className="py-6 md:py-8">
        <SwarmSessionHeader sessionId={swarmId ?? '—'} title="Swarm session" />
        <SwarmError message="Swarm data is unavailable" />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="full" className="py-6 md:py-8">
      <SwarmSessionHeader sessionId={sessionId} title={premise} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <SwarmOverviewSidebar
            round={LIVE_SESSION.round}
            totalRounds={LIVE_SESSION.totalRounds}
            personas={activePersonas}
            startedAt={LIVE_SESSION.startedAt}
            elapsed={LIVE_SESSION.elapsed}
          />
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <AgentFeed messages={debateMessages} />
        </div>

        <div className="lg:col-span-3 order-3">
          <SwarmTelemetryPanel items={swarmTelemetry} />
        </div>
      </div>
    </PageContainer>
  );
}
