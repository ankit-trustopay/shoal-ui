import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';
import { AI_MODEL_ERROR_VERDICT } from '../../lib/debateResult';
import type { ExecutiveDecisionReport } from '../../lib/executiveDecisionReport';
import { STANCE_LABEL } from '../../lib/executiveDecisionReport';
import type { AgentStance } from '../../lib/executiveDecisionReport';
import { MonoLabel } from '../ui/MonoLabel';

export type { ExecutiveDecisionReport };

export interface DebateResultsDashboardProps {
  report: ExecutiveDecisionReport;
  showErrorState?: boolean;
  showModelError?: boolean;
}

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ConfidenceRing({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
      <svg width="144" height="144" className="-rotate-90" aria-hidden>
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="#2563eb"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
          {value}%
        </span>
        <span className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
          Confidence
        </span>
      </div>
    </div>
  );
}

const STANCE_STYLES: Record<
  AgentStance,
  { badge: string; border: string }
> = {
  agrees: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-100',
  },
  disagrees: {
    badge: 'bg-red-50 text-red-800 border-red-200',
    border: 'border-red-100',
  },
  neutral: {
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    border: 'border-gray-200',
  },
};

function ModelErrorState() {
  return (
    <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50/80 via-white to-white p-8 sm:p-10">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-red-700">
          <AlertTriangle size={28} aria-hidden />
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          The AI model could not finish this debate
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          {AI_MODEL_ERROR_VERDICT} Try again with a shorter query or retry in a
          few minutes.
        </p>
        <Link
          to="/app/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          <RefreshCw size={16} aria-hidden />
          Start a new debate
        </Link>
      </div>
    </div>
  );
}

function EmptyVerdictState() {
  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-white p-8 sm:p-10">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <AlertTriangle size={28} aria-hidden />
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Deliberation finished without a verdict
        </h2>
        <p className="text-sm leading-relaxed text-gray-600">
          The engine completed but returned no usable consensus. Check your
          OpenRouter configuration and retry the debate.
        </p>
      </div>
    </div>
  );
}

function ReportSection({
  title,
  accent = 'default',
  children,
  className = '',
}: {
  title: string;
  accent?: 'default' | 'warning' | 'success';
  children: React.ReactNode;
  className?: string;
}) {
  const accentBar =
    accent === 'warning'
      ? 'bg-orange-500'
      : accent === 'success'
        ? 'bg-emerald-500'
        : 'bg-blue-600';

  return (
    <section
      className={`rounded-xl border border-gray-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 sm:px-8">
        <span className={`h-5 w-1 rounded-full ${accentBar}`} aria-hidden />
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-900">
          {title}
        </h2>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-7">{children}</div>
    </section>
  );
}

function WhatIfSandbox() {
  const [price, setPrice] = useState(99);
  const [budget, setBudget] = useState(10000);
  const [audience, setAudience] = useState('');

  return (
    <section className="relative overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative border-b border-gray-100 px-6 py-5">
        <MonoLabel className="mb-2 block text-blue-600">Scenario Lab</MonoLabel>
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          What-If Simulator
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          Stress-test assumptions before committing capital.
        </p>
      </div>

      <div className="relative space-y-5 px-6 py-6">
        <label className="block">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Price
          </span>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={500}
              step={1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-1.5 w-full accent-orange-500"
            />
            <span className="w-14 shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-gray-900">
              ${price}
            </span>
          </div>
        </label>

        <label className="block">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Marketing Budget
          </span>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={50000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="h-1.5 w-full accent-orange-500"
            />
            <span className="w-[4.5rem] shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-gray-900">
              ${budget.toLocaleString()}
            </span>
          </div>
        </label>

        <label className="block">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Target Audience
          </span>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. Series A B2B SaaS founders"
            className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-300 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
          />
        </label>

        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-700"
        >
          <Sparkles size={16} aria-hidden />
          Re-Simulate (10 Credits)
        </button>
        <p className="text-center text-[11px] leading-relaxed text-gray-500">
          Adjust levers, then re-run the swarm against your revised scenario.
        </p>
      </div>
    </section>
  );
}

function VerdictHero({ report }: { report: ExecutiveDecisionReport }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50/80 via-white to-blue-50/30 px-6 py-8 sm:px-10 sm:py-10">
        <MonoLabel className="mb-4 block text-orange-600">
          Executive Verdict
        </MonoLabel>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {report.verdictHeadline}
            </p>
            {report.verdictNarrative && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
                {report.verdictNarrative.length > 320
                  ? `${report.verdictNarrative.slice(0, 317)}…`
                  : report.verdictNarrative}
              </p>
            )}
          </div>
          <ConfidenceRing value={report.confidence} />
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-7 sm:px-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
            TL;DR
          </span>
          <span className="h-px flex-1 bg-gray-200" aria-hidden />
        </div>
        <ul className="space-y-3">
          {report.tldr.map((bullet, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-gray-700 sm:text-base">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                aria-hidden
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FrictionMatrix({
  agents,
}: {
  agents: ExecutiveDecisionReport['frictionAgents'];
}) {
  return (
    <ReportSection title="Swarm Friction">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => {
          const styles = STANCE_STYLES[agent.stance];
          return (
            <article
              key={agent.name}
              className={`flex flex-col rounded-lg border bg-gray-50/30 p-5 ${styles.border}`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900">{agent.name}</h3>
                <span
                  className={`rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
                >
                  [{STANCE_LABEL[agent.stance]}]
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {agent.summary}
              </p>
            </article>
          );
        })}
      </div>
    </ReportSection>
  );
}

function PreMortem({
  failureModes,
  criticalUnknowns,
}: {
  failureModes: string[];
  criticalUnknowns: string[];
}) {
  return (
    <ReportSection title="Risk Radar & Pre-Mortem" accent="warning">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2 text-orange-800">
            <ShieldAlert size={16} aria-hidden />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Top Failure Modes
            </h3>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            How this decision fails within 12 months if assumptions break.
          </p>
          <ol className="space-y-3">
            {failureModes.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-orange-100/80 bg-orange-50/40 px-4 py-3 text-sm leading-relaxed text-gray-800"
              >
                <span className="font-mono text-xs font-bold text-orange-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2 text-red-800">
            <AlertTriangle size={16} aria-hidden />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Critical Unknowns
            </h3>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            Gaps the swarm could not resolve with verified data.
          </p>
          <ul className="space-y-3">
            {criticalUnknowns.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 border-l-2 border-red-300/80 pl-4 text-sm leading-relaxed text-gray-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ReportSection>
  );
}

function EvidenceVault({
  evidence,
}: {
  evidence: ExecutiveDecisionReport['evidence'];
}) {
  return (
    <ReportSection title="Verified Sources">
      <ul className="divide-y divide-gray-100">
        {evidence.map((item, i) => {
          const isPlaceholder = item.url === '#';
          const Tag = isPlaceholder ? 'div' : 'a';
          const linkProps = isPlaceholder
            ? {}
            : {
                href: item.url,
                target: '_blank' as const,
                rel: 'noopener noreferrer',
              };

          return (
            <li key={`${item.url}-${i}`}>
              <Tag
                {...linkProps}
                className={`group flex items-start justify-between gap-4 py-4 transition-colors first:pt-0 last:pb-0 ${
                  isPlaceholder ? 'cursor-default' : 'hover:bg-gray-50/80 -mx-2 px-2 rounded-lg'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    {item.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                    {item.source}
                  </p>
                </div>
                {!isPlaceholder && (
                  <ExternalLink
                    size={16}
                    className="shrink-0 text-gray-400 group-hover:text-blue-600"
                    aria-hidden
                  />
                )}
              </Tag>
            </li>
          );
        })}
      </ul>
    </ReportSection>
  );
}

function ExecutionRoadmap({
  immediateAction,
  planB,
}: {
  immediateAction: string;
  planB: string;
}) {
  return (
    <ReportSection title="Next Steps" accent="success">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-5">
          <div className="mb-3 flex items-center gap-2 text-emerald-800">
            <Target size={16} aria-hidden />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Immediate Action (Next 48 Hours)
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-800">{immediateAction}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-5">
          <div className="mb-3 flex items-center gap-2 text-gray-700">
            <ArrowUpRight size={16} aria-hidden />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Plan B Alternative
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{planB}</p>
        </div>
      </div>
    </ReportSection>
  );
}

function ReportFooter({ meta }: { meta: ExecutiveDecisionReport['meta'] }) {
  const runtime =
    meta.runtimeSec > 0 ? `${meta.runtimeSec}s` : '—';
  return (
    <footer className="border-t border-gray-200 pt-6">
      <p className="text-center font-mono text-[11px] uppercase tracking-widest text-gray-400 sm:text-left">
        Simulation Runtime: {runtime} | Agents Deployed:{' '}
        {meta.agentsDeployed} | Credits Consumed: {meta.creditsConsumed}
      </p>
    </footer>
  );
}

export function DebateResultsDashboard({
  report,
  showErrorState = false,
  showModelError = false,
}: DebateResultsDashboardProps) {
  const sessionDate = formatDate(report.createdAt);
  const statusLine = ['EXECUTIVE DECISION REPORT', report.sessionCode, sessionDate]
    .filter(Boolean)
    .join(' · ');

  if (showModelError) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 px-1">
        <header className="border-b border-gray-200 pb-8">
          <MonoLabel className="mb-3 block text-red-600">{statusLine}</MonoLabel>
          <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {report.premise}
          </h1>
        </header>
        <ModelErrorState />
      </div>
    );
  }

  if (showErrorState || !report.verdictNarrative.trim()) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 px-1">
        <header className="border-b border-gray-200 pb-8">
          <MonoLabel className="mb-3 block text-orange-600">{statusLine}</MonoLabel>
          <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {report.premise}
          </h1>
        </header>
        <EmptyVerdictState />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl pb-12 px-1">
      <header className="mb-10 border-b border-gray-200 pb-8">
        <MonoLabel className="mb-3 block text-blue-600">{statusLine}</MonoLabel>
        <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {report.premise}
        </h1>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-8 lg:flex-[7] lg:basis-0">
          <VerdictHero report={report} />
          <FrictionMatrix agents={report.frictionAgents} />
          <PreMortem
            failureModes={report.failureModes}
            criticalUnknowns={report.criticalUnknowns}
          />
          <EvidenceVault evidence={report.evidence} />
          <ExecutionRoadmap
            immediateAction={report.immediateAction}
            planB={report.planB}
          />
          <ReportFooter meta={report.meta} />
        </div>

        <aside className="lg:flex-[3] lg:basis-0 lg:sticky lg:top-8 lg:self-start">
          <WhatIfSandbox />
        </aside>
      </div>
    </div>
  );
}
