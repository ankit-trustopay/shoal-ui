import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { EnterpriseLiveConsole } from '../components/swarm/live-console/EnterpriseLiveConsole';

export function LiveSwarm() {
  return (
    <PageContainer width="full" className="py-6 md:py-10">
      <EnterpriseLiveConsole />
    </PageContainer>
  );
}
