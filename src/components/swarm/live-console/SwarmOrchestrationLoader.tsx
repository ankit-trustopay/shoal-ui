import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MonoLabel } from '../../ui/MonoLabel';

const ORCHESTRATION_STATUSES = [
  'Injecting 12 Vectors of Humanity...',
  'Agent 04 (High Risk Tolerance) is scraping web data...',
  'Agent 19 (Budget Conscious) is comparing pricing...',
  'Forcing adversarial friction...',
  'Cross-validating dissent channels...',
  'Synthesizing boardroom consensus...',
];

const MATRIX_CHARS = '01アイウエオカキクケコΣΔΘ';

function MatrixRain() {
  const columns = 24;

  return (
    <div
      className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none"
      aria-hidden
    >
      <div className="grid h-full w-full grid-cols-12 gap-1 px-4">
        {Array.from({ length: columns }).map((_, col) => (
          <div
            key={col}
            className="font-mono text-[10px] text-emerald-400/80 leading-tight animate-pulse"
            style={{ animationDelay: `${(col % 8) * 120}ms` }}
          >
            {Array.from({ length: 14 }).map((__, row) => (
              <div key={row}>
                {MATRIX_CHARS[(col + row) % MATRIX_CHARS.length]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SwarmOrchestrationLoaderProps {
  sessionId: string;
  premise?: string | null;
}

export function SwarmOrchestrationLoader({
  sessionId,
  premise,
}: SwarmOrchestrationLoaderProps) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % ORCHESTRATION_STATUSES.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const status = ORCHESTRATION_STATUSES[statusIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#0a0a0b] min-h-[min(520px,70vh)] shadow-2xl">
      <MatrixRain />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[inherit] p-6 sm:p-10">
        <div>
          <MonoLabel className="text-emerald-400/90 mb-3 block">
            Synthetic Society at work
          </MonoLabel>
          <p className="font-mono text-xs text-gray-500 mb-2">
            SESSION · {sessionId}
          </p>
          {premise && (
            <p className="text-sm text-gray-400 max-w-2xl line-clamp-2 mb-8">
              {premise}
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="font-mono text-emerald-500/60 text-sm mb-3">
            &gt; shoal orchestrator --mode=adversarial
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-lg sm:text-xl md:text-2xl text-white tracking-tight"
            >
              {status}
            </motion.p>
          </AnimatePresence>
          <div className="mt-6 flex gap-2">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-2 w-2 rounded-full bg-axiom animate-pulse"
                style={{ animationDelay: `${dot * 200}ms` }}
              />
            ))}
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
          Do not refresh · Agents are in flight
        </p>
      </div>
    </div>
  );
}
