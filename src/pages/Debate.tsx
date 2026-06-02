import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { DebateResultsDashboard } from '../components/debate/DebateResultsDashboard';
import { LiveSimulationDashboard } from '../components/swarm/live-console/LiveSimulationDashboard';
import { SwarmDeliberationFailed } from '../components/swarm/live-console/SwarmDeliberationFailed';
import {
  hasMeaningfulVerdict,
  parseDebateResult,
} from '../lib/debateResult';
import { useDebatePolling } from '../hooks/useDebatePolling';

function DebateLoadError({ message }: { message: string }) {
  return (
    <div
      className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-red-900"
      role="alert"
    >
      <p className="font-semibold">Could not load this debate</p>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}

export function Debate() {
  const { debateId } = useParams();
  const { debate, loading, error } = useDebatePolling(debateId ?? null);

  const sessionCode = useMemo(() => {
    if (!debateId) return 'DBT_UNKNOWN';
    const compact = debateId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `DBT_${compact.slice(0, 8) || 'SEED'}`;
  }, [debateId]);

  const verdictMessage = useMemo(() => {
    const fromMessages =
      debate?.messages?.find((m) => m.role === 'Verdict')?.text ??
      debate?.messages?.find((m) => m.role === 'Manager')?.text ??
      debate?.messages?.find((m) => m.role === 'CEO Synthesizer')?.text ??
      null;
    return fromMessages;
  }, [debate?.messages]);

  const result = useMemo(
    () => parseDebateResult(debate?.resultData ?? null, verdictMessage),
    [debate?.resultData, verdictMessage],
  );

  const agentsFromProfiles = useMemo(() => {
    if (!Array.isArray(debate?.agentProfiles)) return [];
    return debate.agentProfiles
      .map((item, index) => {
        if (!item || typeof item !== 'object') return null;
        const record = item as Record<string, unknown>;
        const name =
          typeof record.name === 'string' && record.name.trim()
            ? record.name.trim()
            : typeof record.role === 'string' && record.role.trim()
              ? record.role.trim()
              : `Agent ${index + 1}`;
        const position =
          typeof record.position === 'string' && record.position.trim()
            ? record.position.trim()
            : typeof record.backstory === 'string' && record.backstory.trim()
              ? record.backstory.trim()
              : '';
        if (!position) return null;
        return { name, position };
      })
      .filter((a): a is { name: string; position: string } => a !== null);
  }, [debate?.agentProfiles]);

  const agents =
    result?.agents && result.agents.length > 0
      ? result.agents
      : agentsFromProfiles;

  const verdict = result?.verdict ?? verdictMessage ?? '';
  const confidence =
    result?.confidence ??
    (typeof debate?.confidence === 'number' ? debate.confidence : 0);

  const status = debate?.status ?? null;

  if (!debateId) {
    return (
      <PageContainer width="full" className="py-8">
        <DebateLoadError message="Missing debate id in the URL." />
      </PageContainer>
    );
  }

  if (error && !debate) {
    return (
      <PageContainer width="full" className="py-8">
        <DebateLoadError message={error} />
      </PageContainer>
    );
  }

  if (status === 'PENDING' || status === 'RUNNING' || (loading && !debate)) {
    return (
      <PageContainer width="full" className="py-8">
        <div className="mx-auto w-full max-w-6xl">
          <LiveSimulationDashboard
            sessionCode={sessionCode}
            premise={debate?.premise ?? null}
          />
        </div>
      </PageContainer>
    );
  }

  if (status === 'FAILED') {
    return (
      <PageContainer width="full" className="py-8">
        <div className="mx-auto w-full max-w-6xl">
          <SwarmDeliberationFailed premise={debate?.premise ?? null} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="full" className="py-8">
      <DebateResultsDashboard
        sessionCode={sessionCode}
        premise={debate?.premise ?? 'Untitled debate'}
        verdict={verdict}
        confidence={confidence}
        agents={agents}
        createdAt={debate?.createdAt ?? null}
        showErrorState={!hasMeaningfulVerdict(verdict)}
      />
    </PageContainer>
  );
}
