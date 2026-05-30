import React from 'react';
import { motion } from 'framer-motion';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';
import { MetricCountUp } from '../motion/CountUp';
import { pressableHover, pressableTap } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface TelemetryItem {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  accent?: boolean;
}

interface SwarmTelemetryPanelProps {
  items: TelemetryItem[];
}

export function SwarmTelemetryPanel({ items }: SwarmTelemetryPanelProps) {
  return (
    <aside>
      <MonoLabel className="mb-4 block">Telemetry</MonoLabel>
      <div className="space-y-4">
        {items.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
          >
            <BentoCard className="rounded-xl p-5">
              <MonoLabel className="mb-3 block">{stat.label}</MonoLabel>
              <div
                className={cn(
                  'text-3xl sm:text-4xl font-bold tracking-tighter leading-none',
                  stat.accent ? 'text-axiom' : 'text-black',
                )}
              >
                <MetricCountUp
                  value={stat.value}
                  delay={0.2 + i * 0.1}
                  duration={1}
                />
              </div>
              {stat.subtext && (
                <div className="text-xs text-gray-500 mt-2">{stat.subtext}</div>
              )}
            </BentoCard>
          </motion.div>
        ))}
      </div>
      <motion.button
        type="button"
        whileHover={pressableHover}
        whileTap={pressableTap}
        className="w-full mt-6 rounded-full px-4 py-3 text-sm font-medium text-black border border-gray-200/60 bg-white hover:bg-gray-50 transition-colors shadow-bento"
      >
        Force Early Synthesis
      </motion.button>
    </aside>
  );
}
