import React from 'react';
import type { DebateTag } from '../../data/liveSwarm';
import { cn } from '../../lib/cn';

const styles: Record<DebateTag, string> = {
  'CHALLENGING PREMISE': 'text-red-700 bg-red-50 border-red-200',
  'CITING SOURCE': 'text-gray-700 bg-gray-100 border-gray-200',
  AGREEMENT: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'COUNTER-ARGUMENT': 'text-amber-700 bg-amber-50 border-amber-200',
  SYNTHESIS: 'text-axiom bg-orange-50 border-orange-200',
};

export function ActionTag({ tag }: { tag: DebateTag }) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border',
        styles[tag],
      )}
    >
      [{tag}]
    </span>
  );
}
