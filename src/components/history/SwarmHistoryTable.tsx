import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SwarmHistoryListItem, SwarmStatus } from '../../lib/api';
import { cn } from '../../lib/cn';

function formatHistoryDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatStatusLabel(status: SwarmStatus): string {
  const labels: Record<SwarmStatus, string> = {
    PENDING: 'Pending',
    RUNNING: 'Running',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
  };
  return labels[status] ?? status;
}

function confidenceStyles(confidence: number | null): {
  dot: string;
  text: string;
} {
  if (confidence == null || confidence <= 0) {
    return { dot: 'bg-gray-300', text: 'text-gray-400' };
  }
  if (confidence > 80) {
    return { dot: 'bg-emerald-500', text: 'text-emerald-700' };
  }
  if (confidence > 50) {
    return { dot: 'bg-orange-500', text: 'text-orange-600' };
  }
  return { dot: 'bg-red-500', text: 'text-red-600' };
}

function statusBadgeClass(status: SwarmStatus): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'RUNNING':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'FAILED':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

interface SwarmHistoryTableProps {
  swarms: SwarmHistoryListItem[];
}

export function SwarmHistoryTable({ swarms }: SwarmHistoryTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 bg-gray-50/80">
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Premise
              </th>
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 w-[140px]">
                Date
              </th>
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 w-[120px]">
                Confidence
              </th>
              <th className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 w-[120px]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {swarms.map((swarm) => {
              const confidence = swarm.confidence ?? null;
              const styles = confidenceStyles(confidence);

              return (
                <tr
                  key={swarm.id}
                  onClick={() =>
                    navigate(`/app/live?swarmId=${encodeURIComponent(swarm.id)}`)
                  }
                  className="border-b border-gray-100 last:border-0 cursor-pointer transition-colors hover:bg-orange-50/40 focus-within:bg-orange-50/40"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 max-w-xl">
                      {swarm.premise}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 tabular-nums whitespace-nowrap">
                    {formatHistoryDate(swarm.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 text-sm font-semibold tabular-nums',
                        styles.text,
                      )}
                    >
                      <span
                        className={cn('h-2 w-2 rounded-full shrink-0', styles.dot)}
                        aria-hidden
                      />
                      {confidence != null && confidence > 0
                        ? `${confidence}%`
                        : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest',
                        statusBadgeClass(swarm.status),
                      )}
                    >
                      {formatStatusLabel(swarm.status)}
                    </span>
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

export function SwarmHistoryTableSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="h-12 bg-gray-50 border-b border-gray-100" />
      {[1, 2, 3, 4].map((key) => (
        <div
          key={key}
          className="flex gap-4 px-5 py-4 border-b border-gray-100 last:border-0"
        >
          <div className="h-4 flex-1 rounded bg-gray-100" />
          <div className="h-4 w-24 rounded bg-gray-100" />
          <div className="h-4 w-16 rounded bg-gray-100" />
          <div className="h-6 w-20 rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
