import React from 'react';
import { cn } from '../../lib/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: 'default' | 'wide' | 'narrow' | 'full';
}

const widthClass = {
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  narrow: 'max-w-4xl',
  full: 'max-w-[1400px]',
};

export function PageContainer({
  children,
  className = '',
  width = 'default',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12',
        widthClass[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
