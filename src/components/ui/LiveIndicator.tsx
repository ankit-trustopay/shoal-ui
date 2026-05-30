import React from 'react';
import { cn } from '../../lib/cn';

interface LiveIndicatorProps {
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function LiveIndicator({
  label = 'LIVE · RESOLVING',
  className = '',
  size = 'md',
}: LiveIndicatorProps) {
  const dot = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full',
        size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5',
        className,
      )}
    >
      <span className={cn('relative flex', dot)}>
        <span
          className={cn(
            'animate-ping absolute inline-flex rounded-full bg-axiom opacity-75',
            dot,
          )}
        />
        <span
          className={cn('relative inline-flex rounded-full bg-axiom animate-pulse', dot)}
        />
      </span>
      <span className="font-mono text-xs font-semibold text-axiom tracking-widest">
        {label}
      </span>
    </div>
  );
}
