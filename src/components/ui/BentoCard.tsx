import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { bentoShadow, bentoShadowHover } from '../../lib/typography';
import { pressableHover, pressableTap } from '../../lib/motion';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'section' | 'article';
  size?: 'md' | 'lg';
  padding?: 'none' | 'md' | 'lg';
}

const sizeClass = {
  md: 'rounded-2xl',
  lg: 'rounded-3xl',
};

const paddingClass = {
  none: '',
  md: 'p-6',
  lg: 'p-6 md:p-8',
};

const cardClass = (hover: boolean, size: 'md' | 'lg', padding: 'none' | 'md' | 'lg', className: string) =>
  cn(
    'bg-white border border-gray-200/60',
    sizeClass[size],
    bentoShadow,
    paddingClass[padding],
    hover && cn('transition-shadow duration-200', bentoShadowHover),
    className,
  );

export function BentoCard({
  children,
  className = '',
  hover = false,
  as: Tag = 'div',
  size = 'md',
  padding = 'none',
}: BentoCardProps) {
  const classes = cardClass(hover, size, padding, className);

  if (hover) {
    return (
      <motion.div
        whileHover={{ ...pressableHover, y: -2 }}
        whileTap={pressableTap}
        className={classes}
      >
        {children}
      </motion.div>
    );
  }

  return <Tag className={classes}>{children}</Tag>;
}
