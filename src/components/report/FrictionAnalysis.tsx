import React from 'react';
import { ShieldAlertIcon, TrendingUpIcon } from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';
import { cn } from '../../lib/cn';

export interface ThesisItem {
  id: string;
  text: string;
  citations: number;
  agent?: string;
}

interface FrictionAnalysisProps {
  winningThesis: ThesisItem[];
  minorityDissent: ThesisItem[];
}

export function FrictionAnalysis({
  winningThesis,
  minorityDissent,
}: FrictionAnalysisProps) {
  return (
    <BentoCard as="section" className="rounded-3xl p-6 md:p-8">
      <MonoLabel variant="accent" className="mb-2 block">
        Friction Analysis
      </MonoLabel>
      <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight mb-1">
        Signal vs. dissent
      </h3>
      <p className="text-sm text-gray-600 mb-5">
        Arguments that survived Shoal AI cross-examination — consensus is not
        unanimity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Winning consensus — SIGNAL */}
        <div
          className={cn(
            'rounded-2xl border border-emerald-200/80 p-4',
            'bg-gradient-to-b from-emerald-50/90 to-white',
          )}
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-200/60">
            <TrendingUpIcon size={14} className="text-emerald-600" />
            <div>
              <MonoLabel className="text-emerald-800 block leading-none">
                Signal
              </MonoLabel>
              <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-700/80">
                Winning consensus
              </span>
            </div>
          </div>
          <ul className="space-y-3">
            {winningThesis.map((w) => (
              <li
                key={w.id}
                className="bg-white/80 border border-emerald-200 rounded-xl p-3 shadow-sm"
              >
                {w.agent && (
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-emerald-800 mb-2">
                    {w.agent}
                  </p>
                )}
                <p className="text-sm text-gray-800 leading-snug mb-2">{w.text}</p>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Cited {w.citations}× in swarm
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Minority dissent — FRICTION */}
        <div
          className={cn(
            'rounded-2xl border border-orange-200/80 p-4',
            'bg-gradient-to-b from-orange-50/70 to-rose-50/30',
          )}
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-orange-200/60">
            <ShieldAlertIcon size={14} className="text-rose-600" />
            <div>
              <MonoLabel className="text-orange-800 block leading-none">
                Friction
              </MonoLabel>
              <span className="font-mono text-[9px] uppercase tracking-widest text-rose-700/80">
                Minority dissent
              </span>
            </div>
          </div>
          <ul className="space-y-3">
            {minorityDissent.map((d) => (
              <li
                key={d.id}
                className="bg-white/80 border border-rose-200/90 rounded-xl p-3 shadow-sm"
              >
                {d.agent && (
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-rose-800 mb-2">
                    {d.agent}
                  </p>
                )}
                <p className="text-sm text-gray-800 leading-snug mb-2">{d.text}</p>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                  Cited {d.citations}× · preserved
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BentoCard>
  );
}
