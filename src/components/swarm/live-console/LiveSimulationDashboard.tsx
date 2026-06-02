import React, { useEffect, useRef, useState } from 'react';
import { Activity, Terminal } from 'lucide-react';
import { MonoLabel } from '../../ui/MonoLabel';

const BOOT_LINES = [
  '> boot: shoal debate pipeline',
  '> agents: researcher → skeptic → synthesizer',
  '> waiting for engine webhook…',
] as const;

const FEED_LINES = [
  'Market Researcher gathering facts…',
  'Skeptical Debater challenging assumptions…',
  'CEO Synthesizer drafting verdict JSON…',
  'Validating OpenRouter response…',
] as const;

export interface LiveSimulationDashboardProps {
  sessionCode?: string;
  premise?: string | null;
}

/**
 * Clean loading state while the engine deliberates (UI-only feed).
 */
export function LiveSimulationDashboard({
  sessionCode = 'DBT_PENDING',
  premise,
}: LiveSimulationDashboardProps) {
  const [lines, setLines] = useState<string[]>([
    ...BOOT_LINES,
    `> session: ${sessionCode}`,
  ]);
  const [tick, setTick] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const feed = window.setInterval(() => {
      const line = FEED_LINES[Math.floor(Math.random() * FEED_LINES.length)];
      setLines((prev) => {
        const next = [...prev, `> ${line}`];
        return next.length > 14 ? next.slice(next.length - 14) : next;
      });
    }, 1600);

    return () => window.clearInterval(feed);
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [lines]);

  return (
    <section
      className="rounded-2xl border border-gray-200 bg-[#0a0b0d] text-white shadow-lg"
      aria-busy="true"
      role="status"
    >
      <div className="border-b border-white/10 px-6 py-5 sm:px-8">
        <MonoLabel className="text-orange-400 mb-2 block">
          Live deliberation
        </MonoLabel>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <Activity size={14} className="text-emerald-400" aria-hidden />
            Engine running
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Terminal size={14} className="text-sky-400" aria-hidden />
            {sessionCode}
          </span>
          <span className="tabular-nums">t+{tick}s</span>
        </div>
        {premise && (
          <p className="mt-3 max-w-3xl text-sm text-gray-300 leading-relaxed line-clamp-2">
            {premise}
          </p>
        )}
      </div>

      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <div
          ref={terminalRef}
          className="max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs leading-relaxed"
        >
          {lines.map((line, index) => (
            <div
              key={`${index}-${line.slice(0, 24)}`}
              className={
                index === lines.length - 1 ? 'text-orange-200' : 'text-gray-300'
              }
            >
              {line}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Results appear automatically when the webhook saves your verdict.
        </p>
      </div>
    </section>
  );
}
