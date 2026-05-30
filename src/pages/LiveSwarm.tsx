import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { SwarmSessionHeader } from '../components/swarm/SwarmSessionHeader';
import { SwarmOverviewSidebar } from '../components/swarm/SwarmOverviewSidebar';
import { AgentFeed } from '../components/swarm/AgentFeed';
import { SwarmTelemetryPanel } from '../components/swarm/SwarmTelemetryPanel';
import { getSwarm } from '../lib/api';
import {
  LIVE_SESSION,
  activePersonas,
  debateMessages,
  swarmTelemetry,
} from '../data/liveSwarm';

export function LiveSwarm() {
  const [searchParams] = useSearchParams();
  const swarmId = searchParams.get('swarmId');

  const [premise, setPremise] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(LIVE_SESSION.id);
  const [loading, setLoading] = useState(Boolean(swarmId));
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!swarmId) {
      setPremise(LIVE_SESSION.title);
      setSessionId(LIVE_SESSION.id);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSwarm() {
      setLoading(true);
      setFetchError(null);

      try {
        const swarm = await getSwarm(swarmId);
        if (cancelled) return;

        setPremise(swarm.premise);
        setSessionId(swarm.id);
      } catch (err) {
        if (cancelled) return;

        setFetchError(
          err instanceof Error ? err.message : 'Failed to load swarm'
        );
        setPremise(LIVE_SESSION.title);
        setSessionId(swarmId);
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

  const title = loading
    ? 'Loading swarm session...'
    : premise ?? LIVE_SESSION.title;

  return (
    <PageContainer width="full" className="py-6 md:py-8">
      <SwarmSessionHeader sessionId={sessionId} title={title} />

      {fetchError &&
      <p className="mb-6 text-sm text-red-600" role="alert">
          {fetchError}
        </p>
      }

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
