import React from 'react';
import { CalculatorIcon, UsersIcon, ZapIcon } from 'lucide-react';
import { MonoLabel } from '../ui/MonoLabel';

const examples = [
  {
    agents: 100,
    cost: 100,
    label: 'Team litmus test',
  },
  {
    agents: 1000,
    cost: 1000,
    label: 'Boardroom-scale swarm',
  },
];

export function HowCreditsWorkSection() {
  return (
    <section
      aria-labelledby="how-credits-work-heading"
      className="mb-10 md:mb-14 rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 via-white to-orange-50/40 p-6 md:p-8 shadow-bento"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <MonoLabel className="mb-2 flex items-center gap-2 text-orange-600">
            <CalculatorIcon size={12} aria-hidden />
            Transparency
          </MonoLabel>
          <h2
            id="how-credits-work-heading"
            className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-3"
          >
            How credits work
          </h2>
          <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">
            1 Virtual Human = 1 Credit.
          </p>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Every simulated person in your swarm draws exactly one credit. No hidden
            multipliers, no surprise line items — the math is linear and predictable.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
          <UsersIcon size={28} aria-hidden />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example) => (
          <div
            key={example.agents}
            className="rounded-xl border border-orange-200/80 bg-white p-5"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
              {example.label}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Running a{' '}
              <span className="font-bold text-black tabular-nums">
                {example.agents.toLocaleString()}-agent
              </span>{' '}
              swarm costs exactly{' '}
              <span className="font-bold text-orange-600 tabular-nums">
                {example.cost.toLocaleString()} credits
              </span>
              .
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3">
        <ZapIcon size={18} className="text-orange-500 shrink-0 mt-0.5" aria-hidden />
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-black">Free Tier</span> includes{' '}
          <span className="font-semibold">150 daily free credits</span> — enough for a 150-agent
          swarm each day, or multiple smaller runs.
        </p>
      </div>
    </section>
  );
}
