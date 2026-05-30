import React from 'react';
import { motion } from 'framer-motion';
import { MonoLabel } from '../ui/MonoLabel';
import { AnimatedProgress } from '../motion/AnimatedProgress';

interface SwarmOverviewSidebarProps {
  round: number;
  totalRounds: number;
  personas: string[];
  startedAt: string;
  elapsed: string;
}

export function SwarmOverviewSidebar({
  round,
  totalRounds,
  personas,
  startedAt,
  elapsed,
}: SwarmOverviewSidebarProps) {
  return (
    <aside className="space-y-8">
      <div>
        <MonoLabel className="mb-4 block">Overview</MonoLabel>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-black">Debate Round</span>
            <span className="font-mono text-xs text-gray-500">
              {round} of {totalRounds}
            </span>
          </div>
          <AnimatedProgress value={round} max={totalRounds} delay={0.2} />
        </div>
      </div>

      <div>
        <MonoLabel className="mb-4 block">Active Personas</MonoLabel>
        <ul className="space-y-3">
          {personas.map((persona, i) => (
            <motion.li
              key={persona}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-axiom/80 shrink-0 animate-pulse" />
              <span className="text-sm text-black">{persona}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div>
        <MonoLabel className="mb-4 block">Started</MonoLabel>
        <div className="text-sm text-gray-700">{startedAt}</div>
        <div className="font-mono text-xs text-gray-400 mt-1">{elapsed} elapsed</div>
      </div>
    </aside>
  );
}
