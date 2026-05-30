import React from 'react';
import { MonoLabel } from '../ui/MonoLabel';
import { LiveIndicator } from '../ui/LiveIndicator';

interface SwarmSessionHeaderProps {
  sessionId: string;
  title: string;
}

export function SwarmSessionHeader({ sessionId, title }: SwarmSessionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 mb-6 border-b border-gray-200/60">
      <div className="min-w-0">
        <MonoLabel className="mb-2 block">
          Shoal AI · Session {sessionId}
        </MonoLabel>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tighter leading-tight">
          {title}
        </h1>
      </div>
      <LiveIndicator className="self-start shrink-0" />
    </div>
  );
}
