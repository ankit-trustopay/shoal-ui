import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}

export function AnimatedProgress({
  value,
  max = 100,
  className = '',
  barClassName = 'bg-axiom',
  delay = 0.15,
}: AnimatedProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        'h-2 bg-gray-100 rounded-full overflow-hidden',
        className,
      )}
    >
      <motion.div
        className={cn('h-full rounded-full', barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{
          duration: 1,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </div>
  );
}
