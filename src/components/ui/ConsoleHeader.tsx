import React from 'react';
import { cn } from '../../lib/cn';
import { MonoLabel } from './MonoLabel';

interface ConsoleHeaderProps {
  breadcrumb: string;
  title: string;
  description?: string;
  className?: string;
}

export function ConsoleHeader({
  breadcrumb,
  title,
  description,
  className = '',
}: ConsoleHeaderProps) {
  return (
    <header className={cn('mb-8 md:mb-10', className)}>
      <MonoLabel className="mb-3 block tracking-[0.2em]">{breadcrumb}</MonoLabel>
      <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tighter leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 mt-2 max-w-2xl">{description}</p>
      )}
    </header>
  );
}
