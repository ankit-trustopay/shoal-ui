import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import {
  COGNITIVE_STAT_MAX,
  type AgentProfile,
  riskTolerancePercent,
  statBarPercent,
} from '../../../lib/agentProfiles';

interface AgentProfileModalProps {
  agent: AgentProfile | null;
  onClose: () => void;
}

function StatBar({
  label,
  value,
  max = COGNITIVE_STAT_MAX,
  colorClass = 'bg-orange-500',
}: {
  label: string;
  value: number;
  max?: number;
  colorClass?: string;
}) {
  const pct = statBarPercent(value, max);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-900 tabular-nums">
          {value}
          <span className="text-xs font-normal text-gray-400 ml-1">/ {max}</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function AgentProfileModal({ agent, onClose }: AgentProfileModalProps) {
  useEffect(() => {
    if (!agent) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [agent, onClose]);

  return (
    <AnimatePresence>
      {agent && (
        <>
          <motion.button
            type="button"
            aria-label="Close profile"
            className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="agent-profile-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-gray-200 bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="relative overflow-hidden border-b border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white px-6 py-8 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 hover:bg-white/80 hover:text-gray-900 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white shadow-lg shadow-orange-500/25">
                {agent.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <h2
                id="agent-profile-title"
                className="mt-5 text-2xl font-bold text-gray-900 tracking-tight"
              >
                {agent.name}
              </h2>
              <p className="mt-1 text-sm font-semibold text-orange-600">{agent.role}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/90 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                  Age {agent.age}
                </span>
                <span className="rounded-full bg-white/90 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                  {agent.riskTolerance} Risk
                </span>
                <span className="rounded-full bg-white/90 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                  IQ {agent.iq}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 space-y-8">
              <section className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-gray-900 flex items-start gap-2">
                    <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    {agent.location}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                    Income
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{agent.income}</p>
                </div>
              </section>

              <section className="space-y-5 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Cognitive profile
                </h3>
                <StatBar label="IQ" value={agent.iq} colorClass="bg-slate-700" />
                <StatBar label="EQ" value={agent.eq} colorClass="bg-orange-500" />
                <StatBar
                  label="Risk tolerance"
                  value={riskTolerancePercent(agent.riskTolerance)}
                  max={100}
                  colorClass="bg-amber-500"
                />
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Life story</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {agent.backstory}
                </p>
              </section>

              <section className="rounded-2xl border border-orange-200/70 bg-orange-50/40 p-5">
                <h3 className="text-sm font-bold text-orange-800 mb-3">
                  Biases & heuristics
                </h3>
                <p className="text-sm text-gray-800 leading-relaxed">{agent.biases}</p>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
