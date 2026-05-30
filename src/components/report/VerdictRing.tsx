import React from 'react';
import { motion } from 'framer-motion';
import { MonoLabel } from '../ui/MonoLabel';
import { CountUp } from '../motion/CountUp';
import { easeOutExpo } from '../../lib/motion';

interface VerdictRingProps {
  percent: number;
  size?: number;
  roundLabel?: string;
}

export function VerdictRing({
  percent,
  size = 220,
  roundLabel = 'Reached Round 14',
}: VerdictRingProps) {
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFE5D6"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FF5A00"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.2,
            ease: easeOutExpo,
            delay: 0.2,
          }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <MonoLabel className="mb-1">Consensus Confidence</MonoLabel>
        <div className="text-5xl font-bold text-black tracking-tighter leading-none">
          <CountUp value={percent} suffix="%" delay={0.35} duration={1.1} />
        </div>
        <MonoLabel variant="accent" className="mt-2">
          {roundLabel}
        </MonoLabel>
      </div>
    </div>
  );
}
