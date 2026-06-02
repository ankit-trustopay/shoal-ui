import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Cpu, Terminal } from 'lucide-react';
import { MonoLabel } from '../../ui/MonoLabel';
import { cn } from '../../../lib/cn';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatDay(day: number) {
  return `Day ${String(day).padStart(2, '0')}`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const AGENT_ACTIONS = [
  'is reviewing pricing elasticity…',
  'is stress-testing the positioning angle…',
  'is cross-referencing competitor claims…',
  'is mapping objections to buyer personas…',
  'is validating assumptions against evidence…',
  'is simulating churn drivers…',
  'is re-scoring sentiment from transcript…',
  'abandoned cart due to high price.',
  'flagged a contradiction in the premise.',
  'requested more data on conversion funnel.',
] as const;

export interface LiveSimulationDashboardProps {
  sessionCode?: string;
  premise?: string | null;
  className?: string;
}

/**
 * Premium loading state while the swarm is deliberating.
 * UI-only simulation: timer, tug-of-war, and live terminal feed.
 */
export function LiveSimulationDashboard({
  sessionCode = 'SWM_PENDING',
  premise,
  className,
}: LiveSimulationDashboardProps) {
  const [day, setDay] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [consensus, setConsensus] = useState(56);
  const [terminalLines, setTerminalLines] = useState<string[]>(() => [
    '> boot: initializing live simulation',
    `> session: ${sessionCode}`,
    '> pipeline: tavily → personas → debate → synthesis',
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const dissent = 100 - consensus;

  const tickRateMs = 85;
  const dayMax = 30;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((s) => s + 1);
      setDay((d) => (d >= dayMax ? 1 : d + 1));
    }, tickRateMs);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const wobble = window.setInterval(() => {
      setConsensus((current) => {
        const drift = randomInt(-7, 7);
        const next = clamp(current + drift, 18, 82);
        return next;
      });
    }, 420);

    return () => window.clearInterval(wobble);
  }, []);

  const seededPrefix = useMemo(() => {
    const seed = sessionCode
      .replace(/[^0-9]/g, '')
      .split('')
      .reduce((acc, ch) => acc + Number(ch), 0);
    return seed > 0 ? seed : 402;
  }, [sessionCode]);

  useEffect(() => {
    const feed = window.setInterval(() => {
      const agentId = seededPrefix + randomInt(0, 650);
      const action = AGENT_ACTIONS[randomInt(0, AGENT_ACTIONS.length - 1)];
      const line = `Agent #${agentId} ${action}`;

      setTerminalLines((prev) => {
        const next = [...prev, line];
        return next.length > 16 ? next.slice(next.length - 16) : next;
      });
    }, 1450);

    return () => window.clearInterval(feed);
  }, [seededPrefix]);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [terminalLines]);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-[#07080a]',
        'shadow-[0_30px_120px_-55px_rgba(249,115,22,0.45)] ring-1 ring-orange-500/15',
        className,
      )}
      aria-busy="true"
      role="status"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.85]"
        aria-hidden
      >
        <div className="absolute -top-24 -right-32 h-72 w-72 rounded-full bg-orange-500/12 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <MonoLabel className="text-orange-400/90 mb-2 block">
              Live Simulation · God Mode
            </MonoLabel>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                <Cpu size={12} className="text-orange-300/80" aria-hidden />
                Engine online
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                <Activity
                  size={12}
                  className="text-emerald-300/80"
                  aria-hidden
                />
                agents deliberating
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                <Terminal size={12} className="text-sky-300/80" aria-hidden />
                session {sessionCode}
              </span>
            </div>
            {premise && (
              <p className="mt-3 max-w-3xl text-sm text-gray-300/90 leading-relaxed line-clamp-2">
                {premise}
              </p>
            )}
          </div>

          <div className="hidden sm:flex shrink-0 flex-col items-end">
            <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-gray-500">
              Time Machine
            </div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">
              {formatDay(day)}
            </div>
            <div className="mt-1 font-mono text-xs tabular-nums text-gray-400">
              t+{seconds.toLocaleString()}s
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Time Machine (mobile/compact) */}
          <div className="sm:hidden rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                Time Machine
              </div>
              <div className="font-mono text-xs tabular-nums text-gray-400">
                t+{seconds.toLocaleString()}s
              </div>
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-white tabular-nums">
              {formatDay(day)}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 shadow-[0_0_16px_rgba(249,115,22,0.55)]"
                style={{ width: `${(day / dayMax) * 100}%` }}
              />
            </div>
          </div>

          {/* Friction Bar */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                Friction Bar
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-mono tabular-nums text-gray-300">
                  Consensus{' '}
                  <span className="text-white">{consensus}%</span>
                </span>
                <span className="font-mono tabular-nums text-gray-300">
                  Dissent <span className="text-white">{dissent}%</span>
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="relative h-3 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/5">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400/90 via-emerald-300/70 to-emerald-200/70"
                  style={{ width: `${consensus}%` }}
                />
                <div
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-rose-400/90 via-rose-300/70 to-rose-200/70"
                  style={{ width: `${dissent}%` }}
                />
                <div
                  className="absolute inset-y-0 w-[2px] bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.55)]"
                  style={{ left: `${consensus}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                <span className="text-emerald-300/80">Consensus</span>
                <span className="text-rose-300/80">Dissent</span>
              </div>
            </div>
          </div>

          {/* Live Terminal */}
          <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-black/45 p-5">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                Live Terminal
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">
                streaming agent events
              </div>
            </div>

            <div
              ref={terminalRef}
              className="max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-[#050607] p-4"
            >
              <div className="space-y-1 font-mono text-xs leading-relaxed">
                {terminalLines.map((line, idx) => (
                  <div
                    key={`${idx}-${line.slice(0, 18)}`}
                    className={cn(
                      'flex items-start gap-2',
                      idx === terminalLines.length - 1
                        ? 'text-orange-200'
                        : 'text-gray-300/90',
                    )}
                  >
                    <span className="select-none text-gray-600">$</span>
                    <span className="min-w-0 break-words">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Waiting for engine webhook to deliver final consensus…
              </p>
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"
                    style={{ animationDelay: `${dot * 160}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

