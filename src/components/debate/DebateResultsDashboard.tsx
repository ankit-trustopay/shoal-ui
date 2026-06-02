import React from 'react';
import { AlertTriangle, Quote, Users } from 'lucide-react';
import type { DebateAgentResult } from '../../lib/debateResult';
import { MonoLabel } from '../ui/MonoLabel';

export interface DebateResultsDashboardProps {
  sessionCode: string;
  premise: string;
  verdict: string;
  confidence: number;
  agents: DebateAgentResult[];
  createdAt?: string | null;
  showErrorState?: boolean;
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
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg width="128" height="128" className="-rotate-90" aria-hidden>
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="8"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">
          {value}%
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
          Confidence
        </span>
      </div>
    </div>
  );
}

function EmptyVerdictState() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 sm:p-10">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <AlertTriangle size={28} aria-hidden />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Deliberation finished without a verdict
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          The engine completed but returned no usable consensus. Check your
          OpenRouter configuration and retry the debate.
        </p>
      </div>
    </div>
  );
}

export function DebateResultsDashboard({
  sessionCode,
  premise,
  verdict,
  confidence,
  agents,
  createdAt,
  showErrorState = false,
}: DebateResultsDashboardProps) {
  const sessionDate = formatDate(createdAt);
  const statusLine = ['CONSENSUS REACHED', sessionCode, sessionDate]
    .filter(Boolean)
    .join(' • ');

  if (showErrorState || !verdict.trim()) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header>
          <MonoLabel className="text-orange-500 mb-3 block">{statusLine}</MonoLabel>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            {premise}
          </h1>
        </header>
        <EmptyVerdictState />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 pb-16">
      <header className="space-y-4">
        <MonoLabel className="text-orange-500 block">{statusLine}</MonoLabel>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
          {premise}
        </h1>
      </header>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/60 to-white p-6 sm:p-10">
        <div className="lg:col-span-8 space-y-6">
          <MonoLabel className="text-orange-500 block">Verdict</MonoLabel>
          <div className="flex gap-4 border-l-4 border-orange-400 pl-5">
            <Quote
              size={24}
              className="text-orange-400 shrink-0 mt-1"
              aria-hidden
            />
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium whitespace-pre-line">
              {verdict}
            </p>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-orange-100 pt-8 lg:pt-0 lg:pl-8">
          <ConfidenceRing value={confidence} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Users size={20} className="text-orange-500" aria-hidden />
          <h2 className="text-lg font-bold text-gray-900">Agent positions</h2>
        </div>

        {agents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {agents.map((agent) => (
              <article
                key={agent.name}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-gray-900">
                  {agent.name}
                </h3>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1">
                  {agent.position}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-600">
            No agent positions were stored for this debate.
          </div>
        )}
      </section>
    </div>
  );
}
