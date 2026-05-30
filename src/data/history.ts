import type { SwarmHistoryItem } from '../components/swarm/SwarmCard';

export const swarmHistory: SwarmHistoryItem[] = [
  {
    id: 'SH-992-02',
    title: 'Should we acquire Northwind Robotics at the $480M valuation?',
    verdict:
      'Do not acquire at $480M. Wait two quarters for enterprise renewal signal. Agent AX-014 led the Financial Skeptic bloc that broke the 12× multiple assumption.',
    confidence: 87,
    agents: 1000,
    credits: 42,
    sources: 4102,
    forVotes: 712,
    against: 198,
    neutral: 90,
    age: '2h ago',
    status: 'COMPLETE',
  },
  {
    id: 'SH-881-14',
    title:
      'Should we raise a Series A now or extend runway 9 months and chase $4M ARR first?',
    verdict:
      'Extend runway and prioritize $4M ARR before raising. Capital-efficient growth commands a 2.4× multiple premium in 2026 — dilution risk of an early round outweighs the wait.',
    confidence: 92,
    agents: 500,
    credits: 30,
    sources: 2180,
    forVotes: 63,
    against: 21,
    neutral: 16,
    age: '1d ago',
    status: 'COMPLETE',
  },
];

export const historyStats = [
  { id: 'stat-total', label: 'Total Swarms', value: '2' },
  { id: 'stat-complete', label: 'Completed', value: '2' },
  { id: 'stat-agents', label: 'Agents Deployed', value: '1,500' },
  { id: 'stat-credits', label: 'Credits Consumed', value: '72 cr' },
];
