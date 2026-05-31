import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { MonoLabel } from '../../ui/MonoLabel';
import { cn } from '../../../lib/cn';

const SWARM_IGNITION_STATUSES = [
  'Initiating Swarm Protocol...',
  'Scraping Live Web Corpus (Tavily)...',
  'Extracting Deep Context from Sources...',
  'Agents Deliberating & Self-Correcting...',
  'Manager Synthesizing Final Consensus...',
] as const;

const SWARM_IGNITION_DURATION_MS = 60_000;
const SWARM_IGNITION_STATUS_CYCLE_MS = 9_000;
const SWARM_IGNITION_ESTIMATE_LABEL =
  'Est. 45–60 seconds · Deep iterative research';

const MATRIX_CHARS = '01アイウエオΣΔΘλ';

function TerminalBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.14]"
      aria-hidden
    >
      <div className="grid h-full w-full grid-cols-10 gap-1 px-4 py-6">
        {Array.from({ length: 20 }).map((_, col) => (
          <div
            key={col}
            className="font-mono text-[9px] leading-tight text-orange-400/90 animate-pulse"
            style={{ animationDelay: `${(col % 6) * 140}ms` }}
          >
            {Array.from({ length: 12 }).map((__, row) => (
              <div key={row}>
                {MATRIX_CHARS[(col + row) % MATRIX_CHARS.length]}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0b]/20 to-[#0a0a0b]" />
    </div>
  );
}

export interface SwarmIgnitionProgressProps {
  sessionCode?: string;
  premise?: string | null;
  variant?: 'hero' | 'overlay';
  className?: string;
}

export function SwarmIgnitionProgress({
  sessionCode = 'SWM_PENDING',
  premise,
  variant = 'hero',
  className,
}: SwarmIgnitionProgressProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = Date.now();

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - started;
      const next = Math.min(100, (elapsed / SWARM_IGNITION_DURATION_MS) * 100);
      setProgress(next);
    }, 120);

    return () => window.clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const statusTimer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % SWARM_IGNITION_STATUSES.length);
    }, SWARM_IGNITION_STATUS_CYCLE_MS);

    return () => window.clearInterval(statusTimer);
  }, []);

  const status = SWARM_IGNITION_STATUSES[statusIndex];
  const progressLabel = `${Math.round(progress)}%`;

  const shellClass =
    variant === 'overlay'
      ? 'w-full max-w-2xl shadow-2xl shadow-orange-500/20'
      : 'w-full shadow-xl shadow-orange-500/10';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-orange-500/35 bg-[#0a0a0b]',
        'ring-1 ring-orange-400/20',
        shellClass,
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20"
        animate={{ opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />

      <TerminalBackdrop />

      <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <MonoLabel className="text-orange-400/90 mb-2 block">
              Swarm ignition
            </MonoLabel>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">
              Session · {sessionCode}
            </p>
            {premise && (
              <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-2 max-w-2xl">
                {premise}
              </p>
            )}
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-[0_0_24px_-4px_rgba(249,115,22,0.55)]">
            <Terminal size={20} aria-hidden />
          </div>
        </div>

        <div className="py-2 sm:py-4">
          <p className="font-mono text-xs text-orange-500/70 mb-3">
            &gt; shoal-engine --deep-research --self-correct
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="font-mono text-lg sm:text-xl md:text-2xl font-medium text-white tracking-tight"
            >
              {status}
            </motion.p>
          </AnimatePresence>
          <div className="mt-5 flex items-center gap-2">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"
                style={{ animationDelay: `${dot * 180}ms` }}
              />
            ))}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Thinking
            </span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
              Orchestration progress
            </span>
            <span className="font-mono text-xs tabular-nums text-orange-400">
              {progressLabel}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800/90 ring-1 ring-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 shadow-[0_0_16px_rgba(249,115,22,0.55)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: 'linear' }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600">
            {SWARM_IGNITION_ESTIMATE_LABEL}
          </p>
        </div>
      </div>
    </div>
  );
}
