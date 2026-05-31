import React from 'react';
import { SwarmIgnitionProgress } from './SwarmIgnitionProgress';

interface SwarmDeliberatingBannerProps {
  sessionCode?: string;
  premise?: string | null;
}

/** Live console deliberation state — premium ignition progress UI. */
export function SwarmDeliberatingBanner({
  sessionCode,
  premise,
}: SwarmDeliberatingBannerProps) {
  return (
    <SwarmIgnitionProgress
      variant="hero"
      sessionCode={sessionCode}
      premise={premise}
    />
  );
}
