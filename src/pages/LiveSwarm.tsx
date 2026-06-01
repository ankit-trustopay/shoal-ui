import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { EnterpriseLiveConsole } from '../components/swarm/live-console/EnterpriseLiveConsole';
import { SwarmDeliberationFailed } from '../components/swarm/live-console/SwarmDeliberationFailed';
import { deriveSwarmStats } from '../components/swarm/live-console/swarmStats';
import { useSwarmPolling } from '../hooks/useSwarmPolling';
import { parseAgentProfiles } from '../lib/agentProfiles';
import { isSwarmFailed } from '../lib/swarmReady';

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

  const { swarm, initialLoading, isPolling, isFailed, fetchError } =
    useSwarmPolling(swarmId);

  const managerMessage = useMemo(() => {
    return swarm?.messages?.find((m) => m.role === 'Manager') ?? null;
  }, [swarm]);

  const debateMessages = useMemo(() => {
    return swarm?.messages?.filter((m) => m.role !== 'Manager') ?? [];
  }, [swarm]);

  const swarmStats = useMemo(() => deriveSwarmStats(swarm), [swarm]);

  const agentProfiles = useMemo(
    () => parseAgentProfiles(swarm?.agentProfiles),
    [swarm?.agentProfiles],
  );

  const sessionCode = useMemo(() => {
    if (!swarmId) return 'SWM_UNKNOWN';
    const compact = swarmId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `SWM_${compact.slice(0, 8) || 'SEED'}`;
  }, [swarmId]);

  const deliberating = isPolling && !fetchError && !isFailed;
  const failed = swarm != null && (isFailed || isSwarmFailed(swarm));

  if (!swarmId) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <SwarmError message="Missing swarmId in URL" />
      </PageContainer>
    );
  }

  if (fetchError && !swarm) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <SwarmError message={fetchError} />
      </PageContainer>
    );
  }

  if (failed) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <SwarmDeliberationFailed premise={swarm?.premise ?? null} />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="full" className="py-6 md:py-10">
      {fetchError && swarm && (
        <p className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          {fetchError}
        </p>
      )}
      <EnterpriseLiveConsole
        swarmId={swarmId}
        loading={initialLoading}
        isDeliberating={deliberating}
        premise={swarm?.premise ?? null}
        managerText={managerMessage?.text ?? null}
        debateMessages={debateMessages}
        agentProfiles={agentProfiles}
        evidence={swarm?.evidence ?? []}
        resultData={swarm?.resultData ?? null}
        debateTranscript={swarm?.debateTranscript ?? null}
        status={swarm?.status ?? null}
        createdAt={swarm?.createdAt ?? null}
        stats={swarmStats}
        sessionCode={sessionCode}
      />
    </PageContainer>
  );
}
