import React from 'react';
import { Kicker } from '../Kicker';
import { cn } from '../../lib/cn';
import { bodyLarge, headingSection } from '../../lib/typography';

interface SectionHeadingProps {
  kicker?: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' && 'text-center max-w-3xl mx-auto',
        className,
      )}
    >
      {kicker && <Kicker className="mb-4 md:mb-6">{kicker}</Kicker>}
      <h2
        className={cn(
          headingSection,
          'text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn(bodyLarge, align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
    </div>
  );
}
