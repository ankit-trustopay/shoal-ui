import React from 'react';
import { BentoCard } from './ui/BentoCard';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/** @deprecated Prefer BentoCard for new components */
export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <BentoCard className={className} hover={hover}>
      {children}
    </BentoCard>
  );
}
