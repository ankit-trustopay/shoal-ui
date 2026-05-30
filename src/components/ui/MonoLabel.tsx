import React from 'react';
import { cn } from '../../lib/cn';

interface MonoLabelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'muted';
  as?: 'span' | 'div' | 'p';
}

const variantClass = {
  default: 'text-gray-500',
  accent: 'text-axiom',
  muted: 'text-gray-400',
};

export function MonoLabel({
  children,
  className = '',
  variant = 'default',
  as: Tag = 'span',
}: MonoLabelProps) {
  return (
    <Tag
      className={cn(
        'font-mono text-[10px] font-semibold uppercase tracking-widest',
        variantClass[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
