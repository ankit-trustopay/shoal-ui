import React from 'react';
import { motion } from 'framer-motion';
import { Kicker } from '../Kicker';
import { FadeIn, Stagger, StaggerItem } from '../FadeIn';
import { archetypes } from '../../data/home';
import { cn } from '../../lib/cn';

const accentStyles: Record<
  string,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  rose: {
    bg: 'bg-rose-50/60',
    border: 'border-rose-200',
    text: 'text-rose-600',
    iconBg: 'bg-rose-100 text-rose-600',
  },
  blue: {
    bg: 'bg-blue-50/60',
    border: 'border-blue-200',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-700',
    iconBg: 'bg-gray-200 text-gray-700',
  },
  emerald: {
    bg: 'bg-emerald-50/60',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
};

export function ArchetypeGrid() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-28">
      <FadeIn className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
        <Kicker className="mb-6">Swarm Architecture</Kicker>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6 leading-tight">
          Diverse minds.
          <br />
          Singular truth.
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          A decision is only as strong as the perspectives that challenge it.
          Shoal AI dynamically spins up specialized agents to attack your premise
          from every angle.
        </p>
      </FadeIn>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {archetypes.map((a) => {
          const Icon = a.icon;
          const s = accentStyles[a.accent];
          return (
            <StaggerItem key={a.id}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'relative h-full border rounded-2xl p-6 shadow-bento hover:shadow-bento-hover transition-shadow duration-200',
                  s.bg,
                  s.border,
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl inline-flex items-center justify-center mb-5',
                    s.iconBg,
                  )}
                >
                  <Icon size={20} />
                </div>
                <div
                  className={cn(
                    'font-mono text-[10px] font-semibold uppercase tracking-widest mb-2',
                    s.text,
                  )}
                >
                  {a.tag}
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                  {a.name}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{a.text}</p>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
