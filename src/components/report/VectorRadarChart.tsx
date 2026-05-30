import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';
import { ExternalLinkIcon } from 'lucide-react';

interface VectorRadarChartProps {
  data: { vector: string; value: number }[];
}

export function VectorRadarChart({ data }: VectorRadarChartProps) {
  return (
    <BentoCard as="section" className="rounded-3xl p-6 md:p-8">
      <MonoLabel variant="accent" className="mb-2 block">
        Swarm DNA
      </MonoLabel>
      <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight mb-1">
        Synthetic Society Composition
      </h3>
      <p className="text-sm text-gray-600 mb-5">
        The 12 Vectors of Humanity injected into this simulation.
      </p>

      <div className="h-[240px] sm:h-[280px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            outerRadius="78%"
            margin={{ top: 10, right: 20, bottom: 0, left: 20 }}
          >
            <PolarGrid stroke="#E5E7EB" strokeDasharray="2 2" />
            <PolarAngleAxis
              dataKey="vector"
              tick={{
                fontSize: 10,
                fill: '#374151',
                fontFamily: 'JetBrains Mono, monospace',
              }}
              tickLine={false}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="value"
              stroke="#FF5A00"
              fill="#FF5A00"
              fillOpacity={0.18}
              strokeWidth={2}
              dot={{ r: 3, fill: '#FF5A00', stroke: '#FF5A00' }}
              isAnimationActive
              animationDuration={900}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-4 border-t border-gray-100">
        <MonoLabel>1,000 agents · 6 active vectors</MonoLabel>
        <button
          type="button"
          className="text-xs font-semibold text-axiom hover:underline inline-flex items-center gap-1 self-start"
        >
          Full breakdown
          <ExternalLinkIcon size={10} />
        </button>
      </div>
    </BentoCard>
  );
}
