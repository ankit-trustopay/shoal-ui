import React from 'react';
import {
  UsersIcon,
  DatabaseIcon,
  ClockIcon,
  CoinsIcon,
  type LucideIcon,
} from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';

const iconMap: Record<string, LucideIcon> = {
  'stat-agents': UsersIcon,
  'stat-sources': DatabaseIcon,
  'stat-runtime': ClockIcon,
  'stat-compute': CoinsIcon,
};

interface Stat {
  id: string;
  label: string;
  value: string;
}

interface ReportStatsFooterProps {
  stats: Stat[];
}

export function ReportStatsFooter({ stats }: ReportStatsFooterProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = iconMap[s.id] ?? UsersIcon;
        return (
          <BentoCard
            key={s.id}
            className="rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-3"
          >
            <div>
              <MonoLabel className="mb-0.5 block">{s.label}</MonoLabel>
              <div className="text-lg font-bold text-black tracking-tighter">
                {s.value}
              </div>
            </div>
            <Icon size={16} className="text-gray-300 shrink-0" />
          </BentoCard>
        );
      })}
    </div>
  );
}
