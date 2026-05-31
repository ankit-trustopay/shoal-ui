import React from 'react';
import { Link } from 'react-router-dom';
import { ReceiptIcon, SparklesIcon } from 'lucide-react';
import type { SwarmHistoryListItem } from '../../lib/api';
import { formatCostCredits } from '../swarm/live-console/swarmStats';
import { MonoLabel } from '../ui/MonoLabel';
import { BentoCard } from '../ui/BentoCard';
import { cn } from '../../lib/cn';

function formatUsageDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCostDeduction(cost: number | null | undefined): string {
  if (cost == null || cost <= 0) return '—';
  return `-${formatCostCredits(cost)} Credits`;
}

function resolveAgentCount(swarm: SwarmHistoryListItem): number {
  if (typeof swarm.agentCount === 'number' && swarm.agentCount > 0) {
    return swarm.agentCount;
  }
  return 0;
}

interface CreditsUsageTableProps {
  swarms: SwarmHistoryListItem[];
  loading?: boolean;
}

export function CreditsUsageTable({ swarms, loading }: CreditsUsageTableProps) {
  if (loading) {
    return <CreditsUsageTableSkeleton />;
  }

  if (swarms.length === 0) {
    return <CreditsUsageEmptyState />;
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 bg-gray-50/90">
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 w-[200px]">
                Date
              </th>
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Premise
              </th>
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 w-[160px] text-right">
                Agents deployed
              </th>
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 w-[140px] text-right">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {swarms.map((swarm) => {
              const agents = resolveAgentCount(swarm);
              const costLabel = formatCostDeduction(swarm.cost);
              const hasCost = swarm.cost != null && swarm.cost > 0;

              return (
                <tr
                  key={swarm.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-orange-50/30 transition-colors"
                >
                  <td className="px-5 py-4 text-sm text-gray-600 tabular-nums whitespace-nowrap align-top">
                    {formatUsageDate(swarm.createdAt)}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <Link
                      to={`/app/live?swarmId=${encodeURIComponent(swarm.id)}`}
                      className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-orange-600 transition-colors"
                    >
                      {swarm.premise}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 tabular-nums text-right align-top whitespace-nowrap">
                    {agents > 0 ? agents.toLocaleString() : '—'}
                  </td>
                  <td
                    className={cn(
                      'px-5 py-4 text-sm font-semibold tabular-nums text-right align-top whitespace-nowrap',
                      hasCost ? 'text-orange-600' : 'text-gray-400',
                    )}
                  >
                    {costLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CreditsUsageTableSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-50 border-b border-gray-100" />
      {[1, 2, 3, 4, 5].map((key) => (
        <div
          key={key}
          className="grid grid-cols-4 gap-4 px-5 py-4 border-b border-gray-100 last:border-0"
        >
          <div className="h-4 w-28 rounded bg-gray-100" />
          <div className="h-4 flex-1 rounded bg-gray-100" />
          <div className="h-4 w-16 rounded bg-gray-100 justify-self-end" />
          <div className="h-4 w-20 rounded bg-gray-100 justify-self-end" />
        </div>
      ))}
    </div>
  );
}

function CreditsUsageEmptyState() {
  return (
    <BentoCard className="text-center py-16 px-6 rounded-2xl border-dashed border-gray-300">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
        <ReceiptIcon size={24} aria-hidden />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No usage yet</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
        When you ignite a swarm, credit draws and agent counts will appear here.
      </p>
      <Link
        to="/app/new"
        className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-black transition-colors"
      >
        <SparklesIcon size={14} aria-hidden />
        Start your first swarm
      </Link>
    </BentoCard>
  );
}
