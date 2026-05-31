import React from 'react';
import { FadeIn } from '../FadeIn';
import { LiveIndicator } from '../ui/LiveIndicator';
import { MonoLabel } from '../ui/MonoLabel';
import { homeAgents, homeStats } from '../../data/home';
import { MetricCountUp } from '../motion/CountUp';
import { bentoCardClass } from '../../lib/typography';
import { cn } from '../../lib/cn';

export function ConsoleMockup() {
  return (
    <FadeIn as="section" className="px-4 sm:px-6 pb-20 md:pb-24">
      <div
        className={cn(
          bentoCardClass,
          'max-w-5xl mx-auto rounded-2xl shadow-2xl shadow-black/5 overflow-hidden',
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-200/60 bg-white">
          <MonoLabel>SHOAL AI CONSOLE · SESSION SH-992-02</MonoLabel>
          <LiveIndicator size="sm" />
        </div>

        <div className="px-4 sm:px-6 md:px-10 pt-8 pb-6 border-b border-gray-200/60">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black tracking-tight text-center max-w-3xl mx-auto leading-snug">
            Should we proceed with the acquisition at the proposed valuation, or wait
            two quarters for revised unit economics?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-b md:border-b-0 md:border-r border-gray-200/60">
            <div className="px-4 sm:px-6 py-3 border-b border-gray-200/60 bg-gray-50/50">
              <MonoLabel>Agent Activity</MonoLabel>
            </div>
            <div>
              {homeAgents.map((agent, idx) => (
                <div
                  key={agent.id}
                  className={cn(
                    'grid grid-cols-12 items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4',
                    idx !== homeAgents.length - 1 && 'border-b border-gray-100',
                  )}
                >
                  <div className="col-span-3 font-mono text-xs text-gray-500">
                    {agent.id}
                  </div>
                  <div className="col-span-4 text-sm font-semibold text-black">
                    {agent.name}
                  </div>
                  <div className="col-span-5 text-sm text-gray-500 truncate">
                    {agent.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="px-4 sm:px-6 py-3 border-b border-gray-200/60 bg-gray-50/50">
              <MonoLabel>Live Stats</MonoLabel>
            </div>
            <div>
              {homeStats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-4 sm:px-6 py-4 border-b border-gray-100"
                >
                  <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-black tracking-tight">
                        <MetricCountUp value={stat.value} delay={0.4} duration={1.2} />
                      </span>
                    <span className="text-sm text-gray-500">{stat.label}</span>
                  </div>
                  {stat.sublabel && (
                    <MonoLabel className="text-gray-400">{stat.sublabel}</MonoLabel>
                  )}
                </div>
              ))}
              <div className="px-4 sm:px-6 py-5">
                <MonoLabel variant="accent" className="mb-1 block">
                  Signal · Verdict
                </MonoLabel>
                <div className="text-xl font-bold text-black tracking-tight">
                  Do not acquire at $480M. Wait for renewals.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-200/60 bg-gray-50/50">
          <MonoLabel>Consensus Confidence</MonoLabel>
          <div className="text-sm font-bold text-black tracking-tight">
            <MetricCountUp value="87.4%" delay={0.6} duration={1.2} />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
