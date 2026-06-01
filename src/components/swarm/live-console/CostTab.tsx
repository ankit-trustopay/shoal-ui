import React from 'react';
import { BrainCircuit, Globe, Receipt, Users } from 'lucide-react';
import { MonoLabel } from '../../ui/MonoLabel';
import {
  formatCostCredits,
  type SwarmConsoleStats,
} from './swarmStats';

const COST_LINES = [
  {
    key: 'search',
    label: 'Live Web Search (Tavily API)',
    share: 0.1,
    icon: Globe,
    accent: 'text-sky-600 bg-sky-50 border-sky-100',
  },
  {
    key: 'agents',
    label: 'Agent Deliberation',
    share: 0.7,
    icon: Users,
    accent: 'text-orange-600 bg-orange-50 border-orange-100',
  },
  {
    key: 'manager',
    label: 'Manager Synthesis & Formatting',
    share: 0.2,
    icon: BrainCircuit,
    accent: 'text-violet-600 bg-violet-50 border-violet-100',
  },
] as const;

function lineAmount(total: number, share: number): number {
  if (total <= 0) return 0;
  return Math.round(total * share * 100) / 100;
}

export function CostTab({ stats }: { stats: SwarmConsoleStats }) {
  const total = stats.cost;
  const hasCost = total > 0;

  const rows = COST_LINES.map((line) => {
    const amount = lineAmount(total, line.share);
    const Icon = line.icon;
    const label =
      line.key === 'agents'
        ? `${line.label} (${stats.agentCount.toLocaleString()} Agents)`
        : line.label;

    return {
      ...line,
      label,
      amount,
      Icon,
      percentLabel: `${Math.round(line.share * 100)}% of total cost`,
    };
  });

  const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const totalDisplay = hasCost ? formatCostCredits(total) : '—';

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-5">
          <div>
            <MonoLabel className="text-gray-500 mb-1 block">Compute receipt</MonoLabel>
            <h3 className="text-lg font-bold text-gray-900">Swarm cost breakdown</h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-500">
            <Receipt size={20} aria-hidden />
          </div>
        </div>

        <ul className="divide-y divide-gray-100">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between px-4 sm:px-6 py-5 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${row.accent}`}
                >
                  <row.Icon size={18} aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    {row.label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                    {row.percentLabel}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold text-gray-900 tabular-nums pt-0.5">
                {hasCost ? `${formatCostCredits(row.amount)} cr` : '—'}
              </p>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-200 bg-gradient-to-br from-orange-50/80 to-white px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                Total cost
              </p>
              <p className="text-sm text-gray-600">
                {hasCost
                  ? 'Itemized charges sum to your swarm debit.'
                  : 'Cost will appear when the swarm completes.'}
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900 tabular-nums">
              {totalDisplay}
              {hasCost && (
                <span className="text-base font-semibold text-gray-500 ml-1">cr</span>
              )}
            </p>
          </div>
          {hasCost && Math.abs(subtotal - total) > 0.01 && (
            <p className="mt-3 font-mono text-[10px] text-gray-400">
              Rounded line items: {formatCostCredits(subtotal)} cr
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
