import React from 'react';
import { motion } from 'framer-motion';
import { Kicker } from '../Kicker';
import { FadeIn, Stagger, StaggerItem } from '../FadeIn';
import { comparisons } from '../../data/home';
import { bentoCardClass } from '../../lib/typography';
import { cn } from '../../lib/cn';

export function ComparisonGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-28">
      <FadeIn className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <Kicker className="mb-6">The Intelligence Trap</Kicker>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tighter mb-6">
          Built for a high-stakes decision.
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Search engines tell you what happened yesterday. Standard AI is trained
          to be polite. Shoal AI replaces the single AI yes-man with a synthetic
          society of disagreement.
        </p>
      </FadeIn>

      <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {comparisons.map((item) => (
          <StaggerItem key={item.id}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={cn(
                bentoCardClass,
                'h-full rounded-xl p-6 md:p-8 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-shadow',
              )}
            >
              <div className="text-3xl font-bold text-axiom mb-6 tracking-tight">
                {item.letter}
              </div>
              <h3 className="text-xl font-bold text-black mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
