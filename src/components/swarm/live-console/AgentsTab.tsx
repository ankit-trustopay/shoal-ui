import React, { useState } from 'react';
import { ChevronRight, Users } from 'lucide-react';
import type { AgentProfile } from '../../../lib/agentProfiles';
import { AgentProfileModal } from './AgentProfileModal';
import { MonoLabel } from '../../ui/MonoLabel';

function AgentCard({
  agent,
  onSelect,
}: {
  agent: AgentProfile;
  onSelect: (agent: AgentProfile) => void;
}) {
  const initials = agent.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(agent)}
      className="group text-left rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-md">
          {initials}
        </div>
        <ChevronRight
          size={18}
          className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-900 tracking-tight">{agent.name}</h3>
      <p className="mt-1 text-sm font-medium text-orange-600">{agent.role}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
          {agent.riskTolerance} Risk
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
          IQ: {agent.iq}
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
          EQ: {agent.eq}
        </span>
      </div>
      <p className="mt-4 text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {agent.location} · {agent.age} yrs
      </p>
    </button>
  );
}

function AgentsEmptyState({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3].map((key) => (
          <div
            key={key}
            className="animate-pulse rounded-2xl border border-gray-200/80 bg-white p-6 h-[220px]"
            aria-hidden
          >
            <div className="h-12 w-12 rounded-xl bg-gray-100 mb-5" />
            <div className="h-5 w-2/3 rounded bg-gray-100 mb-2" />
            <div className="h-4 w-1/2 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 py-20 px-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <Users size={28} />
      </div>
      <p className="text-sm font-semibold text-gray-700">
        No profile data available for this swarm
      </p>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
        Older swarms may not include Synthetic Society dossiers. Re-deploy with the
        latest engine to generate dynamic agent profiles.
      </p>
    </div>
  );
}

interface AgentsTabProps {
  agentProfiles: AgentProfile[];
  loading?: boolean;
}

export function AgentsTab({ agentProfiles, loading = false }: AgentsTabProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);
  const hasProfiles = agentProfiles.length > 0;

  return (
    <div className="pt-2">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <MonoLabel className="mb-2 block">Synthetic society</MonoLabel>
          <h3 className="text-lg font-bold text-gray-900">Archetype leaders</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Five key voices representing the full simulated swarm. Select a card to open
            the full CRM-style dossier.
          </p>
        </div>
        {hasProfiles && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            {agentProfiles.length} active agents
          </span>
        )}
      </div>

      {hasProfiles ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {agentProfiles.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onSelect={setSelectedAgent}
            />
          ))}
        </div>
      ) : (
        <AgentsEmptyState loading={loading} />
      )}

      <AgentProfileModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
