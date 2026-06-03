import { useMemo, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  FileText,
  MessageCircle,
  Newspaper,
  Radio,
  Youtube,
} from 'lucide-react';
import type {
  EvidenceCluster,
  EvidenceClusterId,
  ResearchCoverage,
} from '../../lib/executiveDecisionReport';

const CLUSTER_ICONS: Record<EvidenceClusterId, typeof MessageCircle> = {
  reddit: MessageCircle,
  youtube: Youtube,
  official: FileText,
  news: Newspaper,
};

const CLUSTER_TAB_STYLES: Record<
  EvidenceClusterId,
  { active: string; idle: string }
> = {
  reddit: {
    active: 'border-orange-300 bg-orange-50 text-orange-900 shadow-sm',
    idle: 'border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50/50',
  },
  youtube: {
    active: 'border-red-300 bg-red-50 text-red-900 shadow-sm',
    idle: 'border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50/50',
  },
  official: {
    active: 'border-blue-300 bg-blue-50 text-blue-900 shadow-sm',
    idle: 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/50',
  },
  news: {
    active: 'border-slate-400 bg-slate-100 text-slate-900 shadow-sm',
    idle: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
  },
};

function StatTile({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: number;
  sublabel: string;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-4 sm:p-5">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-bold tabular-nums tracking-tight sm:text-4xl ${accent}`}
      >
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-gray-500">{sublabel}</p>
    </div>
  );
}

function ClusterSourceList({ cluster }: { cluster: EvidenceCluster }) {
  if (cluster.items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center text-sm text-gray-500">
        No sources mapped to this cluster for this debate. Tavily ingest may
        have routed findings elsewhere.
      </p>
    );
  }

  return (
    <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
      {cluster.items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 rounded-lg border border-slate-100 bg-white px-3 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50/30"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 group-hover:text-blue-700">
                {item.source}
              </p>
              <p className="mt-0.5 text-sm font-medium leading-snug text-gray-900 line-clamp-2">
                {item.title}
              </p>
              <p className="mt-1 truncate font-mono text-[11px] text-blue-600 group-hover:underline">
                {item.url}
              </p>
            </div>
            <ExternalLink
              size={14}
              className="mt-1 shrink-0 text-slate-400 group-hover:text-blue-600"
              aria-hidden
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ResearchEvidenceVault({
  coverage,
}: {
  coverage: ResearchCoverage;
}) {
  const { stats, clusters } = coverage;
  const firstWithItems = clusters.find((c) => c.items.length > 0)?.id ?? 'reddit';
  const [activeId, setActiveId] = useState<EvidenceClusterId>(firstWithItems);

  const activeCluster = useMemo(
    () => clusters.find((c) => c.id === activeId) ?? clusters[0],
    [clusters, activeId],
  );

  const totalMapped = clusters.reduce((n, c) => n + c.items.length, 0);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 sm:px-8">
        <span className="h-5 w-1 rounded-full bg-blue-600" aria-hidden />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-gray-900">
            The Evidence Vault
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Research coverage map — structured clusters, not a raw URL dump
          </p>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Radio size={14} className="text-blue-700" aria-hidden />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              Research coverage
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600">
              {totalMapped} cited in report
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="Sources checked"
              value={stats.sourcesChecked}
              sublabel="Crawled & scored by Tavily"
              accent="text-slate-900"
            />
            <StatTile
              label="High-signal"
              value={stats.highSignal}
              sublabel="Passed relevance threshold"
              accent="text-emerald-700"
            />
            <StatTile
              label="Contradictory"
              value={stats.contradictory}
              sublabel="Conflicting claims flagged"
              accent="text-amber-700"
            />
            <StatTile
              label="Dominant consensus"
              value={stats.dominantConsensus}
              sublabel="Strong directional agreement"
              accent="text-blue-700"
            />
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Source clusters
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {clusters.map((cluster) => {
              const Icon = CLUSTER_ICONS[cluster.id];
              const isActive = cluster.id === activeId;
              const tabStyle = CLUSTER_TAB_STYLES[cluster.id];
              return (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => setActiveId(cluster.id)}
                  className={`flex flex-col items-start rounded-lg border px-3 py-3 text-left transition-all ${
                    isActive ? tabStyle.active : tabStyle.idle
                  }`}
                >
                  <Icon size={16} className="mb-2 opacity-80" aria-hidden />
                  <span className="text-xs font-bold leading-tight">
                    {cluster.label}
                  </span>
                  <span className="mt-1 font-mono text-[10px] opacity-70">
                    {cluster.items.length} sources
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeCluster && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200">
                <BookOpen size={16} className="text-slate-700" aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {activeCluster.label}
                </h3>
                <p className="text-xs text-gray-500">{activeCluster.subtitle}</p>
              </div>
            </div>
            <ClusterSourceList cluster={activeCluster} />
          </div>
        )}
      </div>
    </section>
  );
}
