import React, { useEffect, useMemo, useState } from 'react';
import { Radio } from 'lucide-react';
import {
  computeBoardroomCountdownSeconds,
  formatBoardroomCountdown,
} from '../../lib/boardroomCountdown';
import { MonoLabel } from '../ui/MonoLabel';

const RESEARCH_FEED = [
  'Spawning Virtual Human personas...',
  'Tavily scraping live web sources...',
  'Analyzing Reddit and forum sentiment...',
  'Cross-referencing 100+ data points...',
  'Agents engaging in adversarial debate...',
  'CEO Synthesizer compiling boardroom report...',
] as const;

function nextCountdownSeconds(prev: number, maxSeconds: number): number {
  if (prev <= 0) return 0;

  let next = prev - 1;

  if (Math.random() < 0.3) {
    const magnitude = 2 + Math.floor(Math.random() * 4);
    const sign = Math.random() > 0.42 ? -1 : 1;
    next = prev + sign * magnitude;
  }

  return Math.max(0, Math.min(maxSeconds + 45, next));
}

const FINALIZING_LABELS = [
  'Finalizing Synthesis...',
  'Awaiting Final Report...',
] as const;

export interface BoardroomPreparationProps {
  sessionCode?: string;
  premise?: string | null;
  agentCount?: number | null;
  /** True while the client is polling the API for COMPLETED/FAILED. */
  isPolling?: boolean;
}

export function BoardroomPreparation({
  sessionCode = 'DBT_PENDING',
  premise,
  agentCount,
  isPolling = true,
}: BoardroomPreparationProps) {
  const startSeconds = useMemo(
    () => computeBoardroomCountdownSeconds(agentCount),
    [agentCount],
  );
  const [secondsLeft, setSecondsLeft] = useState(startSeconds);
  const [feedIndex, setFeedIndex] = useState(0);
  const [feedHistory, setFeedHistory] = useState<string[]>([RESEARCH_FEED[0]]);
  const [finalizingIndex, setFinalizingIndex] = useState(0);

  const isFinalizing = secondsLeft <= 0;

  useEffect(() => {
    setSecondsLeft(startSeconds);
  }, [startSeconds]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => nextCountdownSeconds(prev, startSeconds));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startSeconds]);

  useEffect(() => {
    if (!isFinalizing) return;
    const timer = window.setInterval(() => {
      setFinalizingIndex((i) => (i + 1) % FINALIZING_LABELS.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [isFinalizing]);

  useEffect(() => {
    let timeoutId = 0;

    const scheduleNext = () => {
      const delayMs = 4000 + Math.floor(Math.random() * 4001);
      timeoutId = window.setTimeout(() => {
        setFeedIndex((i) => {
          const next = (i + 1) % RESEARCH_FEED.length;
          const line = RESEARCH_FEED[next];
          setFeedHistory((hist) => {
            const updated = [...hist, line];
            return updated.length > 6 ? updated.slice(-6) : updated;
          });
          return next;
        });
        scheduleNext();
      }, delayMs);
    };

    scheduleNext();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const activeFeed = isFinalizing
    ? 'CEO Synthesizer packaging the 7-zone executive report...'
    : RESEARCH_FEED[feedIndex];

  const timerDisplay = isFinalizing
    ? FINALIZING_LABELS[finalizingIndex]
    : formatBoardroomCountdown(secondsLeft);

  return (
    <div
      className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#07080c] text-slate-100"
      aria-busy="true"
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center px-6 py-12 sm:px-10">
        <header className="mb-10 border-b border-cyan-500/20 pb-8">
          <MonoLabel className="mb-3 block text-cyan-400/90">
            Executive Decision Boardroom
          </MonoLabel>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Boardroom Preparation
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            The swarm is conducting mandatory deep research before agents take
            their seats. Your report will load automatically when synthesis
            completes.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <span className="inline-flex items-center gap-2 text-emerald-400/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live
            </span>
            <span>{sessionCode}</span>
            {typeof agentCount === 'number' && agentCount > 0 && (
              <span>{agentCount.toLocaleString()} agents queued</span>
            )}
          </div>
          {premise && (
            <p className="mt-4 max-w-3xl border-l-2 border-orange-500/50 pl-4 text-sm leading-relaxed text-slate-300">
              {premise}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Estimated completion
            </p>
            <p
              className={`mt-3 font-bold tracking-tight text-cyan-300 ${
                isFinalizing
                  ? 'text-2xl leading-snug sm:text-3xl'
                  : 'font-mono text-6xl tabular-nums sm:text-7xl'
              }`}
              aria-label={
                isFinalizing
                  ? timerDisplay
                  : `Estimated time remaining ${timerDisplay}`
              }
            >
              {timerDisplay}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              {isFinalizing
                ? 'Research and agent debate are complete. Shoal is writing your boardroom report — this page will refresh automatically.'
                : 'Timer scales with agent count and adjusts as Tavily research progresses — similar to a live transfer ETA.'}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl border border-slate-700/80 bg-slate-950/80 shadow-[0_0_40px_rgba(6,182,212,0.08)]">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-400/90">
                  <Radio size={12} aria-hidden />
                  Live Research Feed
                </span>
                <span className="font-mono text-[10px] text-slate-600">SYS/SHOAL</span>
              </div>

              <div className="space-y-4 px-5 py-6">
                <p className="font-mono text-sm text-orange-200 transition-opacity duration-500">
                  <span className="text-slate-600">&gt; </span>
                  {activeFeed}
                </p>

                <ul className="space-y-2 border-t border-slate-800/80 pt-4">
                  {feedHistory.map((line, index) => (
                    <li
                      key={`${index}-${line}`}
                      className={`font-mono text-xs leading-relaxed ${
                        index === feedHistory.length - 1
                          ? 'text-slate-400'
                          : 'text-slate-600'
                      }`}
                    >
                      <span className="text-slate-700">&gt; </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
            {isPolling
              ? 'Checking database every 3s · deepseek/deepseek-chat'
              : 'Connecting · deepseek/deepseek-chat'}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}
