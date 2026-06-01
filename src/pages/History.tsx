import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, SparklesIcon } from 'lucide-react';
import { PageContainer } from '../components/ui/PageContainer';
import { ConsoleHeader } from '../components/ui/ConsoleHeader';
import { BentoCard } from '../components/ui/BentoCard';
import { MonoLabel } from '../components/ui/MonoLabel';
import {
  SwarmHistoryTable,
  SwarmHistoryTableSkeleton,
} from '../components/history/SwarmHistoryTable';
import { listSwarms, type SwarmHistoryListItem } from '../lib/api';

function deriveHistoryStats(swarms: SwarmHistoryListItem[]) {
  const completed = swarms.filter((s) => s.status === 'COMPLETED').length;
  const withConfidence = swarms.filter(
    (s) => typeof s.confidence === 'number' && s.confidence > 0,
  );
  const avgConfidence =
    withConfidence.length > 0
      ? Math.round(
          withConfidence.reduce((sum, s) => sum + (s.confidence ?? 0), 0) /
            withConfidence.length,
        )
      : 0;
  const totalCost = swarms.reduce((sum, s) => sum + (s.cost ?? 0), 0);

  return [
    { id: 'stat-total', label: 'Total Swarms', value: String(swarms.length) },
    { id: 'stat-complete', label: 'Completed', value: String(completed) },
    {
      id: 'stat-confidence',
      label: 'Avg Confidence',
      value: withConfidence.length > 0 ? `${avgConfidence}%` : '—',
    },
    {
      id: 'stat-credits',
      label: 'Credits Used',
      value: totalCost > 0 ? `${totalCost.toFixed(2)} cr` : '0 cr',
    },
  ];
}

function HistoryEmptyState() {
  return (
    <BentoCard className="text-center py-20 px-6 rounded-2xl border-dashed border-gray-300">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
        <SparklesIcon size={28} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No swarms ignited yet</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
        Your deliberation history will appear here after you run your first swarm.
      </p>
      <Link
        to="/app/new"
        className="inline-flex items-center gap-2 bg-orange-500 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm"
      >
        <SparklesIcon size={14} />
        Start New Swarm
      </Link>
    </BentoCard>
  );
}

export function History() {
  const [query, setQuery] = useState('');
  const [swarms, setSwarms] = useState<SwarmHistoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await listSwarms();
        if (!cancelled) {
          setSwarms(data);
        }
      } catch (err) {
        if (!cancelled) {
          const detail =
            err instanceof Error ? err.message : 'Failed to load swarm history';
          setError(
            detail.includes('Failed to load')
              ? `${detail}. Please refresh.`
              : `Failed to load swarm history. Please refresh. (${detail})`,
          );
          setSwarms([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return swarms;
    return swarms.filter((swarm) => swarm.premise.toLowerCase().includes(q));
  }, [swarms, query]);

  const stats = useMemo(() => deriveHistoryStats(swarms), [swarms]);

  return (
    <PageContainer width="default" className="pb-16 pt-6 md:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <ConsoleHeader
          breadcrumb="CONSOLE / HISTORY"
          title="Swarm history"
          description="Every dilemma you've put to the swarm. Click any row to open the full report."
          className="mb-0"
        />
        <Link
          to="/app/new"
          className="inline-flex items-center gap-2 bg-axiom text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors self-start whitespace-nowrap shadow-sm"
        >
          <SparklesIcon size={14} />
          New swarm
        </Link>
      </div>

      {!loading && !error && swarms.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {stats.map((stat) => (
            <BentoCard key={stat.id} className="rounded-2xl p-5">
              <MonoLabel className="mb-2 block">{stat.label}</MonoLabel>
              <div className="text-2xl sm:text-3xl font-bold text-black tracking-tighter leading-none">
                {stat.value}
              </div>
            </BentoCard>
          ))}
        </div>
      )}

      {error && (
        <BentoCard className="mb-6 rounded-2xl border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </BentoCard>
      )}

      {!loading && !error && swarms.length > 0 && (
        <div className="relative mb-6">
          <SearchIcon
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dilemmas..."
            className="w-full bg-white pl-12 pr-5 py-3.5 border border-gray-200/60 rounded-2xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors shadow-bento"
          />
        </div>
      )}

      {loading && <SwarmHistoryTableSkeleton />}

      {!loading && !error && swarms.length === 0 && <HistoryEmptyState />}

      {!loading && !error && swarms.length > 0 && filtered.length > 0 && (
        <SwarmHistoryTable swarms={filtered} />
      )}

      {!loading && !error && swarms.length > 0 && filtered.length === 0 && (
        <BentoCard className="text-center py-16 rounded-2xl">
          <p className="text-gray-500">No swarms match your search.</p>
        </BentoCard>
      )}
    </PageContainer>
  );
}
