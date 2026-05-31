import type { SwarmRecord } from './api';

export function isSwarmReady(swarm: SwarmRecord): boolean {
  if (swarm.status === 'FAILED') {
    return true;
  }

  const messages = swarm.messages ?? [];
  const hasManager = messages.some((message) => message.role === 'Manager');
  const hasConfidence =
    typeof swarm.confidence === 'number' && swarm.confidence > 0;

  return hasManager && hasConfidence;
}

export function isSwarmProcessing(swarm: SwarmRecord): boolean {
  return swarm.status !== 'FAILED' && !isSwarmReady(swarm);
}

export function isSwarmFailed(swarm: SwarmRecord): boolean {
  return swarm.status === 'FAILED' && !isSwarmReady(swarm);
}
