import React, { useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
} from 'framer-motion';

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  delay?: number;
}

function useCountUp(
  value: number,
  duration: number,
  delay: number,
): MotionValue<number> {
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [motionValue, value, duration, delay]);

  return motionValue;
}

export function CountUp({
  value,
  duration = 1.2,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  delay = 0,
}: CountUpProps) {
  const motionValue = useCountUp(value, duration, delay);
  const rounded = useTransform(motionValue, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    return `${prefix}${n}${suffix}`;
  });

  return <motion.span className={className}>{rounded}</motion.span>;
}

import { parseMetricValue } from '../../lib/parseMetricValue';

export function MetricCountUp({
  value,
  className = '',
  duration = 1.2,
  delay = 0,
}: {
  value: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const parsed = parseMetricValue(value);
  const hasNumber = /[\d]/.test(value);

  if (!hasNumber || !Number.isFinite(parsed.numeric)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <CountUp
      value={parsed.numeric}
      prefix={parsed.prefix}
      suffix={parsed.suffix}
      decimals={parsed.decimals}
      className={className}
      duration={duration}
      delay={delay}
    />
  );
}
