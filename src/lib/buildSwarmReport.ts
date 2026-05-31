import type { SwarmConsoleStats } from '../components/swarm/live-console/swarmStats';

function votePercent(count: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function formatCostCredits(cost: number): string {
  if (cost === 0) return '0';
  if (Number.isInteger(cost)) return String(cost);
  return cost.toFixed(2);
}

export interface SwarmReportInput {
  swarmId: string;
  premise: string;
  stats: SwarmConsoleStats;
  managerConsensus: string;
  sessionCode?: string;
}

export function buildSwarmReportText({
  swarmId,
  premise,
  stats,
  managerConsensus,
  sessionCode,
}: SwarmReportInput): string {
  const total = stats.totalVotingAgents;
  const forPct = votePercent(stats.votesFor, total);
  const againstPct = votePercent(stats.votesAgainst, total);
  const neutralPct = votePercent(stats.votesNeutral, total);

  const lines = [
    'SHOAL AI — SWARM CONSENSUS REPORT',
    '='.repeat(48),
    '',
    `Swarm ID: ${swarmId}`,
    ...(sessionCode ? [`Session: ${sessionCode}`] : []),
    `Generated: ${new Date().toISOString()}`,
    '',
    'PREMISE',
    '-'.repeat(48),
    premise.trim(),
    '',
    'CONFIDENCE',
    '-'.repeat(48),
    `${stats.confidence}%`,
    '',
    'VOTE DISTRIBUTION',
    '-'.repeat(48),
    `Total agents voting: ${total}`,
    `For:     ${stats.votesFor} (${forPct}%)`,
    `Against: ${stats.votesAgainst} (${againstPct}%)`,
    `Neutral: ${stats.votesNeutral} (${neutralPct}%)`,
    `Swarm alignment with consensus: ${stats.agreementPercent}%`,
    '',
    'RUN METRICS',
    '-'.repeat(48),
    `Agents: ${stats.agentCount}`,
    `Sources: ${stats.sourceCount}`,
    `Runtime: ${stats.runtime}s`,
    `Cost: ${formatCostCredits(stats.cost)} cr`,
    '',
    'MANAGER CONSENSUS',
    '-'.repeat(48),
    managerConsensus.trim(),
    '',
    '— End of report —',
  ];

  return lines.join('\n');
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
