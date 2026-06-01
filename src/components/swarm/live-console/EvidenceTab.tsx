import React from 'react';
import { ExternalLink, FileSearch } from 'lucide-react';
import type { SwarmEvidenceRecord } from '../../../lib/api';
import { MonoLabel } from '../../ui/MonoLabel';

function EvidenceCard({ item }: { item: SwarmEvidenceRecord }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-orange-500">
          {item.source}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200/80 bg-gray-50 text-gray-400 transition-colors group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-600">
          <ExternalLink size={15} aria-hidden />
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-900 leading-snug mb-3 group-hover:text-orange-950 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
        {item.snippet}
      </p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-orange-500/80 transition-colors truncate">
        Open source
      </p>
    </a>
  );
}

function EvidenceSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="animate-pulse rounded-2xl border border-gray-200/80 bg-white p-6 h-[200px]"
          aria-hidden
        >
          <div className="h-3 w-24 rounded bg-gray-100 mb-4" />
          <div className="h-5 w-full rounded bg-gray-100 mb-3" />
          <div className="h-4 w-full rounded bg-gray-100 mb-2" />
          <div className="h-4 w-4/5 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function EvidenceEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 py-20 px-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <FileSearch size={28} />
      </div>
      <p className="text-sm font-semibold text-gray-700">
        No external evidence was required for this consensus
      </p>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
        This swarm did not attach live web sources, or it was created before Tavily
        evidence capture was enabled.
      </p>
    </div>
  );
}

interface EvidenceTabProps {
  evidence: SwarmEvidenceRecord[];
  loading?: boolean;
}

export function EvidenceTab({ evidence, loading = false }: EvidenceTabProps) {
  const hasEvidence = evidence.length > 0;

  return (
    <div className="pt-2">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <MonoLabel className="mb-2 block">Live web corpus</MonoLabel>
          <h3 className="text-lg font-bold text-gray-900">Evidence</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Sources retrieved during swarm ignition — ranked for deliberation weight.
            Click any card to open the original page.
          </p>
        </div>
        {hasEvidence && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            {evidence.length} source{evidence.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {loading && !hasEvidence ? (
        <EvidenceSkeletonGrid />
      ) : hasEvidence ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {evidence.map((item) => (
            <EvidenceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EvidenceEmptyState />
      )}
    </div>
  );
}
