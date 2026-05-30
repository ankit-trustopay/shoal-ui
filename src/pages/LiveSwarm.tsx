import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { SwarmSessionHeader } from '../components/swarm/SwarmSessionHeader';
import { SwarmOverviewSidebar } from '../components/swarm/SwarmOverviewSidebar';
import { AgentFeed } from '../components/swarm/AgentFeed';
import { SwarmTelemetryPanel } from '../components/swarm/SwarmTelemetryPanel';
import {
  LIVE_SESSION,
  activePersonas,
  debateMessages,
  swarmTelemetry,
} from '../data/liveSwarm';

export function LiveSwarm() {
  return (
    <PageContainer width="full" className="py-6 md:py-8">
      <SwarmSessionHeader
        sessionId={LIVE_SESSION.id}
        title={LIVE_SESSION.title}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <SwarmOverviewSidebar
            round={LIVE_SESSION.round}
            totalRounds={LIVE_SESSION.totalRounds}
            personas={activePersonas}
            startedAt={LIVE_SESSION.startedAt}
            elapsed={LIVE_SESSION.elapsed}
          />
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <AgentFeed messages={debateMessages} />
        </div>

        <div className="lg:col-span-3 order-3">
          <SwarmTelemetryPanel items={swarmTelemetry} />
        </div>
      </div>
    </PageContainer>
  );
}
