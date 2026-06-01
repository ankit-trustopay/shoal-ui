import React, { useMemo, useState } from 'react';
import { ExternalLink, Quote } from 'lucide-react';
import { CONSOLE_TABS, type ConsoleTabId } from '../../../data/liveConsoleMock';
import type { AgentProfile } from '../../../lib/agentProfiles';
import type {
  SwarmEvidenceRecord,
  SwarmMessageRecord,
  SwarmStatus,
} from '../../../lib/api';
import { resolveDebateTranscript } from '../../../lib/debateTranscript';
import { parseSwarmOverview } from '../../../lib/swarmOverview';
import { DebateTab } from './DebateTab';
import { MonoLabel } from '../../ui/MonoLabel';
import { AgentsTab } from './AgentsTab';
import { CostTab } from './CostTab';
import { EvidenceTab } from './EvidenceTab';
import { ConsoleToast, useConsoleToast } from '../../ui/ConsoleToast';
import { LiveConsoleActionBar } from './LiveConsoleActionBar';
import { SwarmDeliberatingBanner } from './SwarmDeliberatingBanner';
import {
  formatCostCredits,
  votePercent,
  type SwarmConsoleStats,
} from './swarmStats';

interface EnterpriseLiveConsoleProps {
  swarmId: string;
  loading: boolean;
  isDeliberating?: boolean;
  premise: string | null;
  managerText: string | null;
  debateMessages: SwarmMessageRecord[];
  agentProfiles: AgentProfile[];
  evidence: SwarmEvidenceRecord[];
  resultData: unknown;
  status: SwarmStatus | null;
  createdAt: string | null;
  stats: SwarmConsoleStats;
  sessionCode: string;
}

function formatSessionDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatStatusLabel(
  status: SwarmStatus | null,
  hasConsensus: boolean,
): string {
  if (status === 'FAILED') return 'SWARM FAILED';
  if (status === 'RUNNING' || status === 'PENDING') return 'DELIBERATING';
  if (hasConsensus) return 'CONSENSUS REACHED';
  if (status === 'COMPLETED') return 'SWARM COMPLETE';
  return 'SWARM SESSION';
}

function ConfidenceRing({ value }: { value: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-[140px] w-[140px] items-center justify-center">
      <svg width="140" height="140" className="-rotate-90" aria-hidden>
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 tabular-nums">
          {value}%
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
          Confidence
        </span>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200/60 bg-white/70 px-5 py-4 min-w-[108px]">
      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900 tabular-nums">
        {value}
        {unit && (
          <span className="text-sm font-medium text-gray-500 ml-0.5">{unit}</span>
        )}
      </p>
    </div>
  );
}

function ConsensusSkeleton() {
  return (
    <div className="animate-pulse space-y-3" aria-hidden>
      <div className="h-5 w-full rounded bg-orange-100/80" />
      <div className="h-5 w-[95%] rounded bg-orange-100/80" />
      <div className="h-5 w-[88%] rounded bg-orange-100/80" />
    </div>
  );
}

function TitleSkeleton() {
  return (
    <div className="animate-pulse max-w-4xl space-y-3 mb-8" aria-hidden>
      <div className="h-10 w-full rounded-lg bg-orange-100/80" />
      <div className="h-10 w-[92%] rounded-lg bg-orange-100/80" />
    </div>
  );
}

function VoteDistributionSection({ stats }: { stats: SwarmConsoleStats }) {
  const total = stats.totalVotingAgents;
  const forPct = votePercent(stats.votesFor, total);
  const againstPct = votePercent(stats.votesAgainst, total);
  const neutralPct = votePercent(stats.votesNeutral, total);

  const columns = [
    {
      label: 'For',
      percent: `${forPct}%`,
      count: stats.votesFor,
      dotClass: 'bg-orange-500',
    },
    {
      label: 'Against',
      percent: `${againstPct}%`,
      count: stats.votesAgainst,
      dotClass: 'bg-red-500',
    },
    {
      label: 'Neutral',
      percent: `${neutralPct}%`,
      count: stats.votesNeutral,
      dotClass: 'bg-gray-300',
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <MonoLabel>Vote distribution</MonoLabel>
        <p className="text-sm text-gray-500">
          {total > 0 ? total : stats.agentCount} agents voting
        </p>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100 mb-8">
        <div
          className="bg-orange-500 transition-all"
          style={{ width: `${forPct}%` }}
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${againstPct}%` }}
        />
        <div
          className="bg-gray-300 transition-all"
          style={{ width: `${neutralPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.label}
            className="rounded-xl border border-gray-200/70 bg-gray-50/50 px-5 py-5 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`h-2.5 w-2.5 rounded-full ${col.dotClass}`} />
              <span className="text-sm font-medium text-gray-700">{col.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">
              {col.percent}
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">
              {col.count}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OverviewTab({
  stats,
  evidence,
  resultData,
}: {
  stats: SwarmConsoleStats;
  evidence: SwarmEvidenceRecord[];
  resultData: unknown;
}) {
  const { recommendedActions, minorityDissent } = useMemo(
    () => parseSwarmOverview(resultData),
    [resultData],
  );

  const hasActions = recommendedActions.length > 0;
  const hasDissent = minorityDissent !== null;
  const hasEvidence = evidence.length > 0;

  return (
    <div className="space-y-10 pt-2">
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-5">Recommended Action</h3>
        {hasActions ? (
          <ol className="space-y-4">
            {recommendedActions.map((action) => (
              <li
                key={`${action.step}-${action.title}`}
                className="flex gap-4 rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {action.step}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{action.body}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-10 px-6 text-center">
            <p className="text-sm text-gray-600">
              No strategic actions generated for this query.
            </p>
          </div>
        )}
      </section>

      {hasDissent && (
        <section className="rounded-2xl border border-red-200/80 bg-red-50/50 p-6 sm:p-8">
          <MonoLabel className="text-red-700 mb-3 block">Minority dissent</MonoLabel>
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {minorityDissent}
          </p>
          {stats.votesAgainst > 0 && (
            <p className="mt-3 font-mono text-xs text-red-700/80">
              {stats.votesAgainst.toLocaleString()} agents · dissenting view
            </p>
          )}
        </section>
      )}

      {hasEvidence && (
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <h3 className="text-lg font-bold text-gray-900">Top Evidence</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              From swarm research
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm hover:border-orange-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-orange-500">
                    {item.source}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-gray-400 group-hover:text-orange-500 shrink-0"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {item.snippet}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function EnterpriseLiveConsole({
  swarmId,
  loading,
  isDeliberating = false,
  premise,
  managerText,
  debateMessages,
  agentProfiles,
  evidence,
  resultData,
  status,
  createdAt,
  stats,
  sessionCode,
}: EnterpriseLiveConsoleProps) {
  const [activeTab, setActiveTab] = useState<ConsoleTabId>('overview');
  const { toastMessage, showToast } = useConsoleToast();

  const sessionDate = formatSessionDate(createdAt);
  const statusLabel = formatStatusLabel(status, Boolean(managerText));
  const statusLine = [statusLabel, sessionCode, sessionDate]
    .filter(Boolean)
    .join(' • ');

  const debateTranscript = useMemo(
    () => resolveDebateTranscript(resultData),
    [resultData],
  );

  const tabs = CONSOLE_TABS.map((tab) => {
    if (tab.id === 'evidence' && evidence.length > 0) {
      return { ...tab, count: evidence.length };
    }
    if (tab.id === 'agents' && agentProfiles.length > 0) {
      return { ...tab, count: agentProfiles.length };
    }
    return tab;
  });

  const showDeliberating = isDeliberating || (loading && !managerText);
  const showHeroSkeleton = showDeliberating && !managerText;

  return (
    <div className="space-y-10 pb-20">
      <ConsoleToast message={toastMessage} />
      <LiveConsoleActionBar
        swarmId={swarmId}
        premise={premise ?? ''}
        managerText={managerText}
        stats={stats}
        sessionCode={sessionCode}
        resultData={resultData}
        actionsDisabled={showDeliberating}
        onToast={showToast}
      />

      {showDeliberating && !managerText && (
        <SwarmDeliberatingBanner sessionCode={sessionCode} premise={premise} />
      )}

      <section className="rounded-2xl border border-orange-100/80 bg-gradient-to-br from-orange-50/50 to-white p-6 sm:p-10 shadow-sm">
        <p className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-5 break-words">
          {statusLine}
        </p>

        {showHeroSkeleton && !premise ? (
          <TitleSkeleton />
        ) : loading && !premise ? (
          <TitleSkeleton />
        ) : (
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.08] max-w-5xl mb-10">
            {premise}
          </h1>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div>
              <MonoLabel className="text-orange-500 mb-4 block">Consensus</MonoLabel>
              {showHeroSkeleton || (loading && !managerText) ? (
                <ConsensusSkeleton />
              ) : managerText ? (
                <div className="flex gap-4 border-l-4 border-orange-400/90 pl-5">
                  <Quote
                    size={28}
                    className="text-orange-400 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <blockquote className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium">
                    {managerText}
                  </blockquote>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic pl-1">
                  Manager consensus is not available yet.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
              <StatBox label="Agents" value={stats.agentCount} />
              <StatBox
                label="Sources"
                value={stats.sourceCount > 0 ? stats.sourceCount : '—'}
              />
              <StatBox label="Runtime" value={stats.runtime} unit="s" />
              <StatBox
                label="Cost"
                value={formatCostCredits(stats.cost)}
                unit="cr"
              />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-orange-100/80 pt-10 lg:pt-0 lg:pl-10">
            <ConfidenceRing
              value={showDeliberating && stats.confidence === 0 ? 0 : stats.confidence}
            />
            <p className="mt-5 text-center text-sm text-gray-600 max-w-[220px] leading-relaxed">
              <span className="font-semibold text-gray-900">
                {stats.agreementPercent}%
              </span>{' '}
              of swarm aligned with final consensus
            </p>
          </div>
        </div>
      </section>

      <VoteDistributionSection stats={stats} />

      <nav
        className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-px"
        aria-label="Console sections"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 sm:px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                isActive
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-1.5 font-mono text-xs ${
                    isActive ? 'text-orange-400' : 'text-gray-400'
                  }`}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-6">
        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            evidence={evidence}
            resultData={resultData}
          />
        )}
        {activeTab === 'evidence' && (
          <EvidenceTab
            evidence={evidence}
            loading={showDeliberating || loading}
          />
        )}
        {activeTab === 'agents' && (
          <AgentsTab
            agentProfiles={agentProfiles}
            loading={showDeliberating || loading}
          />
        )}
        {activeTab === 'debate' && (
          <DebateTab messages={debateMessages} transcript={debateTranscript} />
        )}
        {activeTab === 'cost' && <CostTab stats={stats} />}
      </div>
    </div>
  );
}
