import React from 'react';
import { FadeIn, Stagger, StaggerItem } from '../FadeIn';
import { impactMetrics } from '../../data/home';
import { cn } from '../../lib/cn';

export function EnterpriseImpactSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-28">
      <FadeIn>
        <div className="relative bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 md:p-14 overflow-hidden">
          <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="max-w-3xl mb-10 md:mb-12">
              <div className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-axiom mb-5">
                Enterprise Impact
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mb-5">
                Decades of research,
                <br />
                compressed into minutes.
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
                Operators at top funds and global enterprises use Shoal AI to
                replace whole research weeks with single-session swarms.
              </p>
            </div>

            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {impactMetrics.map((m) => (
                <StaggerItem key={m.id}>
                  <div className="border-t border-zinc-800 pt-6">
                    <div
                      className={cn(
                        'text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-none mb-3',
                        m.highlight ? 'text-axiom' : 'text-white',
                      )}
                    >
                      {m.value}
                    </div>
                    <div className="text-base font-semibold text-white tracking-tight mb-1.5">
                      {m.label}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{m.sub}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
