import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { LiveSimulationDashboard } from '../components/swarm/live-console/LiveSimulationDashboard';
import { EnterpriseLiveConsole } from '../components/swarm/live-console/EnterpriseLiveConsole';
import { SwarmDeliberationFailed } from '../components/swarm/live-console/SwarmDeliberationFailed';
import { deriveSwarmStats } from '../components/swarm/live-console/swarmStats';
import { parseAgentProfiles } from '../lib/agentProfiles';
import { resolveDebateTranscript } from '../lib/debateTranscript';
import { useDebatePolling } from '../hooks/useDebatePolling';

function DebateError({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl border-4 border-red-600 bg-red-50 px-8 py-10 text-red-900 text-xl md:text-2xl font-bold leading-relaxed"
      role="alert"
    >
      ERROR FETCHING DEBATE: {message}
    </div>
  );
}

export function Debate() {
  const { debateId } = useParams();
  const { debate, loading, error } = useDebatePolling(debateId ?? null);

  const stats = useMemo(() => deriveSwarmStats(debate), [debate]);
  const agentProfiles = useMemo(
    () => parseAgentProfiles(debate?.agentProfiles),
    [debate?.agentProfiles],
  );

  const debateMessages = useMemo(() => {
    return debate?.messages?.filter((m) => m.role !== 'Manager') ?? [];
  }, [debate]);

  const managerMessage = useMemo(() => {
    return debate?.messages?.find((m) => m.role === 'Manager') ?? null;
  }, [debate]);

  const transcript = useMemo(
    () => resolveDebateTranscript(debate?.resultData ?? null, debate?.debateTranscript ?? null),
    [debate?.resultData, debate?.debateTranscript],
  );

  const sessionCode = useMemo(() => {
    if (!debateId) return 'DBT_UNKNOWN';
    const compact = debateId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `DBT_${compact.slice(0, 8) || 'SEED'}`;
  }, [debateId]);

  const status = debate?.status ?? null;

  if (!debateId) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <DebateError message="Missing debateId in URL" />
      </PageContainer>
    );
  }

  if (error && !debate) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <DebateError message={error} />
      </PageContainer>
    );
  }

  // Pending / in-progress states → Live Simulation.
  if (status === 'PENDING' || status === 'RUNNING' || (loading && !debate)) {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <LiveSimulationDashboard
          sessionCode={sessionCode}
          premise={debate?.premise ?? null}
        />
      </PageContainer>
    );
  }

  if (status === 'FAILED') {
    return (
      <PageContainer width="full" className="py-6 md:py-10">
        <SwarmDeliberationFailed premise={debate?.premise ?? null} />
      </PageContainer>
    );
  }

  // Completed → Results UI.
  return (
    <PageContainer width="full" className="py-6 md:py-10">
      <EnterpriseLiveConsole
        swarmId={debateId}
        loading={false}
        isDeliberating={false}
        premise={debate?.premise ?? null}
        managerText={managerMessage?.text ?? null}
        debateMessages={debateMessages}
        agentProfiles={agentProfiles}
        evidence={debate?.evidence ?? []}
        resultData={debate?.resultData ?? null}
        debateTranscript={transcript}
        status={status}
        createdAt={debate?.createdAt ?? null}
        stats={stats}
        sessionCode={sessionCode}
      />
    </PageContainer>
  );
}

