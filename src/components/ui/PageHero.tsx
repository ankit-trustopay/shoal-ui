import React from 'react';
import { motion } from 'framer-motion';
import { Kicker } from '../Kicker';
import { cn } from '../../lib/cn';
import { bodyLarge, headingHero } from '../../lib/typography';
import { easeOutExpo } from '../../lib/motion';

interface PageHeroProps {
  kicker: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  kickerVariant?: 'orange' | 'gray';
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: easeOutExpo },
  }),
};

export function PageHero({
  kicker,
  title,
  description,
  children,
  className = '',
  kickerVariant = 'orange',
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 md:pb-16 text-center',
        className,
      )}
    >
      <motion.div custom={0} variants={item} initial="hidden" animate="show">
        <Kicker className="mb-6 md:mb-8" variant={kickerVariant}>
          {kicker}
        </Kicker>
      </motion.div>
      <motion.h1
        custom={1}
        variants={item}
        initial="hidden"
        animate="show"
        className={cn(
          headingHero,
          'text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 md:mb-8',
        )}
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          custom={2}
          variants={item}
          initial="hidden"
          animate="show"
          className={cn(bodyLarge, 'max-w-3xl mx-auto')}
        >
          {description}
        </motion.p>
      )}
      {children && (
        <motion.div custom={3} variants={item} initial="hidden" animate="show">
          {children}
        </motion.div>
      )}
    </section>
  );
}
