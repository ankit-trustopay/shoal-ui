import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { SwarmSessionHeader } from '../components/swarm/SwarmSessionHeader';
import { SwarmOverviewSidebar } from '../components/swarm/SwarmOverviewSidebar';
import { SwarmTelemetryPanel } from '../components/swarm/SwarmTelemetryPanel';
import { SwarmOrchestrationLoader } from '../components/swarm/live-console/SwarmOrchestrationLoader';
import { FinalConsensusHero } from '../components/swarm/live-console/FinalConsensusHero';
import { AdversarialTranscript } from '../components/swarm/live-console/AdversarialTranscript';
import { API_BASE, type SwarmRecord } from '../lib/api';
import type { FeedMessage } from '../types/swarm';
import { LIVE_SESSION, activePersonas, swarmTelemetry } from '../data/liveSwarm';

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

function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function mapMessagesToFeed(
  messages: SwarmRecord['messages'] = [],
): FeedMessage[] {
  const tagByRole: Record<string, FeedMessage['tag']> = {
    Skeptic: 'CHALLENGING PREMISE',
    'Financial Skeptic': 'CHALLENGING PREMISE',
    Expert: 'COUNTER-ARGUMENT',
    'Domain Expert': 'CITING SOURCE',
    'Risk Analyst': 'COUNTER-ARGUMENT',
    'Consumer Voice': 'AGREEMENT',
    Optimist: 'AGREEMENT',
    Manager: 'SYNTHESIS',
  };

  return messages.map((message) => ({
    id: message.id,
    persona: message.role,
    timestamp: formatMessageTime(message.createdAt),
    tag: tagByRole[message.role] ?? 'CHALLENGING PREMISE',
    body: message.text,
  }));
}

export function LiveSwarm() {
  const [searchParams] = useSearchParams();
  const swarmId = searchParams.get('swarmId');

  const [premise, setPremise] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [feedMessages, setFeedMessages] = useState<FeedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const managerMessage = useMemo(
    () => feedMessages.find((m) => m.persona === 'Manager'),
    [feedMessages],
  );

  const debateMessages = useMemo(
    () => feedMessages.filter((m) => m.persona !== 'Manager'),
    [feedMessages],
  );

  useEffect(() => {
    if (!swarmId) {
      setLoading(false);
      setFetchError('Missing swarmId in URL');
      setPremise(null);
      setSessionId(null);
      setFeedMessages([]);
      return;
    }

    let cancelled = false;

    async function loadSwarm() {
      setLoading(true);
      setFetchError(null);
      setPremise(null);
      setFeedMessages([]);
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
            errorBody,
          );

          throw new Error(
            `HTTP ${res.status} ${res.statusText}${errorBody ? ` — ${errorBody}` : ''}`,
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
        setFeedMessages(mapMessagesToFeed(swarm.messages));
      } catch (err) {
        if (cancelled) return;

        console.error('Swarm fetch error:', err);

        const message =
          err instanceof Error ? err.message : 'Unknown error loading swarm';

        setFetchError(message);
        setPremise(null);
        setFeedMessages([]);
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

  if (fetchError) {
    return (
      <PageContainer width="full" className="py-6 md:py-8">
        <SwarmSessionHeader sessionId={swarmId ?? '—'} title="Swarm session" />
        <SwarmError message={fetchError} />
      </PageContainer>
    );
  }

  if (!swarmId) {
    return (
      <PageContainer width="full" className="py-6 md:py-8">
        <SwarmSessionHeader sessionId="—" title="Swarm session" />
        <SwarmError message="Missing swarmId in URL" />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="full" className="py-6 md:py-8">
      <SwarmSessionHeader
        sessionId={sessionId ?? swarmId}
        title={loading ? 'Synthetic society convening...' : (premise ?? '—')}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
        <div className="xl:col-span-9 space-y-8 min-w-0">
          {loading ? (
            <SwarmOrchestrationLoader sessionId={swarmId} premise={premise} />
          ) : (
            <>
              {managerMessage ? (
                <FinalConsensusHero
                  verdict={managerMessage.body}
                  sessionId={sessionId ?? swarmId}
                />
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-amber-900 text-sm font-medium">
                  Final consensus is not yet available. The Manager agent has
                  not returned a verdict.
                </div>
              )}

              <AdversarialTranscript messages={debateMessages} />
            </>
          )}
        </div>

        <div className="xl:col-span-3 space-y-6">
          <SwarmOverviewSidebar
            round={LIVE_SESSION.round}
            totalRounds={LIVE_SESSION.totalRounds}
            personas={activePersonas}
            startedAt={LIVE_SESSION.startedAt}
            elapsed={LIVE_SESSION.elapsed}
          />
          {!loading && (
            <SwarmTelemetryPanel items={swarmTelemetry} />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
