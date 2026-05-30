import React from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';

interface Source {
  id: string;
  letter: string;
  name: string;
  domain: string;
  citations: number;
  href: string;
}

interface SourceEvidenceListProps {
  sources: Source[];
}

export function SourceEvidenceList({ sources }: SourceEvidenceListProps) {
  return (
    <BentoCard as="section" className="rounded-3xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <MonoLabel variant="accent" className="mb-2 block">
            Evidence
          </MonoLabel>
          <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight">
            Top sources cited
          </h3>
        </div>
        <MonoLabel>Sorted by citations</MonoLabel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 bg-white border border-gray-200/60 rounded-xl p-4 hover:border-axiom hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-axiom flex items-center justify-center font-bold text-base shrink-0">
              {s.letter}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-sm font-semibold text-black tracking-tight leading-snug group-hover:text-axiom transition-colors">
                  {s.name}
                </div>
                <ExternalLinkIcon
                  size={13}
                  className="text-gray-400 group-hover:text-axiom shrink-0 mt-0.5"
                />
              </div>
              <div className="font-mono text-[11px] text-gray-500 tracking-wide">
                {s.domain}{' '}
                <span className="text-axiom ml-1">×{s.citations}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </BentoCard>
  );
}
