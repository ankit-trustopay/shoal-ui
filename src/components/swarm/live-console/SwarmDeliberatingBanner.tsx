import React from 'react';
import { LiveSimulationDashboard } from './LiveSimulationDashboard';

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
    <LiveSimulationDashboard
      sessionCode={sessionCode}
      premise={premise}
    />
  );
}
