import type { SwarmRecord } from '../../../lib/api';

export interface SwarmConsoleStats {
  agentCount: number;
  sourceCount: number;
  confidence: number;
  runtime: number;
  cost: number;
  votesFor: number;
  votesAgainst: number;
  votesNeutral: number;
  totalVotingAgents: number;
  agreementPercent: number;
}

export function deriveSwarmStats(swarm: SwarmRecord | null): SwarmConsoleStats {
  const votesFor = swarm?.votesFor ?? 0;
  const votesAgainst = swarm?.votesAgainst ?? 0;
  const votesNeutral = swarm?.votesNeutral ?? 0;
  const totalVotingAgents = votesFor + votesAgainst + votesNeutral;
  const agentCount = swarm?.agentCount ?? 0;
  const votingPool = totalVotingAgents > 0 ? totalVotingAgents : agentCount;

  return {
    agentCount,
    sourceCount: swarm?.evidence?.length ?? 0,
    confidence: swarm?.confidence ?? 0,
    runtime: swarm?.runtime ?? 0,
    cost: swarm?.cost ?? 0,
    votesFor,
    votesAgainst,
    votesNeutral,
    totalVotingAgents: votingPool,
    agreementPercent:
      totalVotingAgents > 0
        ? Math.round((votesFor / totalVotingAgents) * 100)
        : 0,
  };
}

export function formatCostCredits(cost: number): string {
  if (cost === 0) return '0';
  if (Number.isInteger(cost)) return String(cost);
  return cost.toFixed(2);
}

export function votePercent(count: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}
