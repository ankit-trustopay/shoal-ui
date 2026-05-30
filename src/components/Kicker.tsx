import React from 'react';
interface KickerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'orange' | 'gray';
}
export function Kicker({
  children,
  className = '',
  variant = 'orange'
}: KickerProps) {
  const colorClass = variant === 'orange' ? 'text-axiom' : 'text-gray-500';
  return (
    <div
      className={`font-mono text-xs font-semibold uppercase tracking-widest ${colorClass} ${className}`}
    >
      {children}
    </div>
  );

}