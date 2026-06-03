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
import type {
  ExecutiveDecisionReport,
  FitRating,
  RecommendationLabel,
} from '../../lib/executiveDecisionReport';
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

const RECOMMENDATION_STYLES: Record<
  RecommendationLabel,
  { text: string; ring: string; bg: string }
> = {
  BUY: {
    text: 'text-emerald-700',
    ring: '#059669',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  WAIT: {
    text: 'text-amber-800',
    ring: '#d97706',
    bg: 'bg-amber-50 border-amber-200',
  },
  PIVOT: {
    text: 'text-orange-800',
    ring: '#ea580c',
    bg: 'bg-orange-50 border-orange-200',
  },
};

const FIT_STYLES: Record<FitRating, string> = {
  Excellent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Good: 'text-blue-800 bg-blue-50 border-blue-200',
  Weak: 'text-gray-700 bg-gray-100 border-gray-200',
};

function ConfidenceRing({
  value,
  size = 'hero',
  strokeColor = '#2563eb',
}: {
  value: number;
  size?: 'hero' | 'default';
  strokeColor?: string;
}) {
  const radius = size === 'hero' ? 62 : 54;
  const dim = size === 'hero' ? 160 : 144;
  const center = dim / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${
        size === 'hero' ? 'h-40 w-40' : 'h-36 w-36'
      }`}
    >
      <svg width={dim} height={dim} className="-rotate-90" aria-hidden>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={size === 'hero' ? 7 : 6}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={size === 'hero' ? 7 : 6}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-bold text-gray-900 tabular-nums tracking-tight ${
            size === 'hero' ? 'text-4xl' : 'text-3xl'
          }`}
        >
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
  const [customScenario, setCustomScenario] = useState('');

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
          Describe an alternate scenario and re-run the swarm.
        </p>
      </div>

      <div className="relative space-y-5 px-6 py-6">
        <label className="block">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Custom Scenario
          </span>
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            rows={5}
            placeholder="e.g., What if my budget is only $500? or What if we only consider post-1990 data?"
            className="mt-2 w-full resize-y rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm leading-relaxed text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-300 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
          />
        </label>

        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-700"
        >
          <Sparkles size={16} aria-hidden />
          Re-Simulate (10 Credits)
        </button>
      </div>
    </section>
  );
}

function ExecutiveBoardroomPanel({ report }: { report: ExecutiveDecisionReport }) {
  const { boardroom } = report;
  const recStyle = RECOMMENDATION_STYLES[boardroom.recommendation];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)]">
      <div className="h-1 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" aria-hidden />
      {/* Hero */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50/90 via-white to-blue-50/20 px-6 py-8 sm:px-10 sm:py-10">
        <MonoLabel className="mb-4 block text-slate-600">
          Executive Boardroom
        </MonoLabel>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1 space-y-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                Recommendation
              </p>
              <p
                className={`mt-1 text-5xl font-bold tracking-tight sm:text-6xl ${recStyle.text}`}
              >
                {boardroom.recommendation}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Fit for you
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-sm font-bold ${FIT_STYLES[boardroom.fitForYou]}`}
              >
                {boardroom.fitForYou}
              </span>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
              {boardroom.reasonLine}
            </p>
          </div>
          <ConfidenceRing
            value={report.confidence}
            size="hero"
            strokeColor={recStyle.ring}
          />
        </div>
        <div className="mt-8 flex gap-2.5 rounded-lg border border-amber-100/80 bg-amber-50/40 px-4 py-3">
          <AlertTriangle
            size={15}
            className="mt-0.5 shrink-0 text-amber-600"
            aria-hidden
          />
          <p className="text-xs leading-relaxed text-gray-500">
            This report is synthesized from adversarial AI debate and live web
            research. We do not claim 100% accuracy. Always verify critical
            decisions.
          </p>
        </div>
      </div>

      {/* 3-column tension board */}
      <div className="grid grid-cols-1 border-b border-gray-100 lg:grid-cols-3">
        <article className="border-b border-gray-100 bg-gradient-to-b from-emerald-50/70 to-white p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">
            Why this should work
          </h3>
          <p className="mt-1 text-xs text-emerald-700/80">Strongest bull case</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-800 sm:text-base">
            {boardroom.bullCase}
          </p>
        </article>
        <article className="border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-blue-900">
            Shoal&apos;s Recommendation
          </h3>
          <p className="mt-1 text-xs text-blue-800/80">Synthesized middle ground</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-800 sm:text-base">
            {boardroom.shoalRecommendation}
          </p>
        </article>
        <article className="bg-gradient-to-b from-orange-50/60 to-white p-6 sm:p-8">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-orange-900">
            Why this could fail
          </h3>
          <p className="mt-1 text-xs text-orange-800/80">Strongest bear / pre-mortem</p>
          <p className="mt-4 text-sm leading-relaxed text-gray-800 sm:text-base">
            {boardroom.bearCase}
          </p>
        </article>
      </div>

      {/* Boardroom summary */}
      <div className="px-6 py-8 sm:px-10 sm:py-9">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-900">
          Boardroom Summary
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              What Shoal Found
            </p>
            <ul className="mt-4 space-y-4">
              {(
                [
                  ['Main Opportunity', boardroom.findings.mainOpportunity],
                  ['Main Risk', boardroom.findings.mainRisk],
                  ['Hidden Tradeoff', boardroom.findings.hiddenTradeoff],
                  ['Best Alternative', boardroom.findings.bestAlternative],
                ] as const
              ).map(([label, value]) => (
                <li key={label} className="flex gap-3">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400"
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-800">
                      {value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Why this matters
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
              {boardroom.findings.whyThisMatters}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TldrBrief({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null;
  return (
    <ReportSection title="Executive Brief">
      <ul className="space-y-3">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex gap-3 border-l border-slate-200 pl-4 text-sm leading-relaxed text-gray-700 sm:text-base"
          >
            <span className="font-mono text-xs font-bold text-slate-400">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </ReportSection>
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
  const validEvidence = evidence.filter(
    (item) => item.url && item.url !== '#' && item.url.startsWith('http'),
  );

  return (
    <ReportSection title="Verified Sources">
      {validEvidence.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {validEvidence.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-2 flex items-start justify-between gap-4 rounded-lg px-2 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-gray-50/80"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                    {item.source}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {item.title}
                  </p>
                  <p className="mt-1 truncate font-mono text-xs text-blue-600 group-hover:underline">
                    {item.url}
                  </p>
                </div>
                <ExternalLink
                  size={16}
                  className="mt-1 shrink-0 text-gray-400 group-hover:text-blue-600"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-gray-500">
          No live web sources were captured for this debate. Sources appear here
          when Tavily research succeeds during deliberation.
        </p>
      )}
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
      <header className="mb-8 border-b border-gray-200 pb-8">
        <MonoLabel className="mb-3 block text-slate-600">{statusLine}</MonoLabel>
        <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {report.premise}
        </h1>
      </header>

      <ExecutiveBoardroomPanel report={report} />

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-8 lg:flex-[7] lg:basis-0">
          <TldrBrief bullets={report.tldr} />
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
