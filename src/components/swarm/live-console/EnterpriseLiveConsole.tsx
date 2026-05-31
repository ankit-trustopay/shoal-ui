import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  CONSOLE_TABS,
  LIVE_CONSOLE_MOCK,
  type ConsoleTabId,
} from '../../../data/liveConsoleMock';
import { MonoLabel } from '../../ui/MonoLabel';

function ConfidenceRing({ value }: { value: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-[140px] w-[140px] items-center justify-center">
      <svg
        width="140"
        height="140"
        className="-rotate-90"
        aria-hidden
      >
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
    <div className="rounded-lg border border-gray-200/80 bg-gray-50/80 px-4 py-3 min-w-[100px]">
      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900 tabular-nums">
        {value}
        {unit && (
          <span className="text-sm font-medium text-gray-500 ml-0.5">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function VoteDistributionBar() {
  const { for: forVotes, against, neutral } = LIVE_CONSOLE_MOCK.votes;
  const total = forVotes + against + neutral;
  const forPct = (forVotes / total) * 100;
  const againstPct = (against / total) * 100;
  const neutralPct = (neutral / total) * 100;

  return (
    <section className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <MonoLabel>Vote distribution</MonoLabel>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            For <strong className="text-gray-900">{forVotes}</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Against <strong className="text-gray-900">{against}</strong>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            Neutral <strong className="text-gray-900">{neutral}</strong>
          </span>
        </div>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="bg-orange-500 transition-all"
          style={{ width: `${forPct}%` }}
          title={`For ${forVotes}`}
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${againstPct}%` }}
          title={`Against ${against}`}
        />
        <div
          className="bg-gray-300 transition-all"
          style={{ width: `${neutralPct}%` }}
          title={`Neutral ${neutral}`}
        />
      </div>
    </section>
  );
}

function OverviewTab() {
  const mock = LIVE_CONSOLE_MOCK;

  return (
    <div className="space-y-10">
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Recommended Action
        </h3>
        <ol className="space-y-4">
          {mock.recommendedActions.map((action) => (
            <li
              key={action.step}
              className="flex gap-4 rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                {action.step}
              </span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {action.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-red-200/80 bg-red-50/50 p-6">
        <MonoLabel className="text-red-700 mb-3 block">Minority dissent</MonoLabel>
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
          {mock.minorityDissent}
        </p>
        <p className="mt-3 font-mono text-xs text-red-700/80">
          {mock.votes.against} agents · dissenting view
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h3 className="text-lg font-bold text-gray-900">Top Evidence</h3>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
            Ranked by swarm weight
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mock.evidence.map((item) => (
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
                {item.excerpt}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-20 text-center">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-700">{label}</span> — coming
        soon
      </p>
    </div>
  );
}

export function EnterpriseLiveConsole() {
  const [activeTab, setActiveTab] = useState<ConsoleTabId>('overview');
  const mock = LIVE_CONSOLE_MOCK;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <header className="space-y-5 pt-2">
        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-500">
          {mock.statusLabel}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.08] max-w-5xl">
          {mock.premise}
        </h1>
      </header>

      {/* Hero stats */}
      <section className="rounded-xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div>
              <MonoLabel className="text-orange-500 mb-3 block">Consensus</MonoLabel>
              <blockquote className="text-lg sm:text-xl text-gray-800 leading-relaxed border-l-4 border-orange-500 pl-5 font-medium">
                {mock.managerVerdict}
              </blockquote>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatBox label="Agents" value={mock.stats.agents} />
              <StatBox label="Sources" value={mock.stats.sources} />
              <StatBox label="Runtime" value={mock.stats.runtimeSec} unit="s" />
              <StatBox label="Cost" value={mock.stats.costCredits} unit="cr" />
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-200/80 pt-8 lg:pt-0 lg:pl-8">
            <ConfidenceRing value={mock.confidence} />
            <p className="mt-4 text-center text-sm text-gray-600 max-w-[200px]">
              <span className="font-semibold text-gray-900">
                {mock.agreementPercent}%
              </span>{' '}
              of swarm aligned with final consensus
            </p>
          </div>
        </div>
      </section>

      <VoteDistributionBar />

      {/* Tabs */}
      <nav
        className="flex flex-wrap gap-1 border-b border-gray-200"
        aria-label="Console sections"
      >
        {CONSOLE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
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

      <div className="pt-4">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'evidence' && <PlaceholderTab label="Evidence" />}
        {activeTab === 'agents' && <PlaceholderTab label="Agents" />}
        {activeTab === 'debate' && <PlaceholderTab label="Debate" />}
        {activeTab === 'cost' && <PlaceholderTab label="Cost" />}
      </div>
    </div>
  );
}
