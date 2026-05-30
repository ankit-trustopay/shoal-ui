import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlertIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';
import { cn } from '../../lib/cn';
import { MetricCountUp } from '../motion/CountUp';

type Accent = 'rose' | 'emerald' | 'orange';

interface MarketImpactItem {
  id: string;
  label: string;
  value: string;
  sub: string;
  accent: Accent;
}

const accentText: Record<Accent, string> = {
  rose: 'text-rose-600',
  emerald: 'text-emerald-600',
  orange: 'text-axiom',
};

const accentBg: Record<Accent, string> = {
  rose: 'bg-rose-50 border-rose-200',
  emerald: 'bg-emerald-50 border-emerald-200',
  orange: 'bg-orange-50 border-orange-200',
};

interface MarketImpactGridProps {
  items: MarketImpactItem[];
}

export function MarketImpactGrid({ items }: MarketImpactGridProps) {
  return (
    <BentoCard as="section" className="rounded-3xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
        <div>
          <MonoLabel variant="accent" className="mb-2 block">
            Forward Indicators
          </MonoLabel>
          <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight">
            Predicted Market Impact
          </h3>
        </div>
        <MonoLabel className="hidden sm:block">12-month horizon</MonoLabel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className={cn('rounded-2xl p-6 border', accentBg[m.accent])}
          >
            <div className="flex items-center justify-between mb-3">
              <MonoLabel>{m.label}</MonoLabel>
              {m.accent === 'rose' && (
                <TrendingDownIcon size={14} className="text-rose-600" />
              )}
              {m.accent === 'emerald' && (
                <TrendingUpIcon size={14} className="text-emerald-600" />
              )}
              {m.accent === 'orange' && (
                <ShieldAlertIcon size={14} className="text-axiom" />
              )}
            </div>
            <div
              className={cn(
                'text-3xl md:text-4xl font-bold tracking-tighter leading-none mb-2',
                accentText[m.accent],
              )}
            >
              <MetricCountUp value={m.value} delay={0.25} duration={1} />
            </div>
            <p className="text-sm text-gray-600 leading-snug">{m.sub}</p>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  );
}
