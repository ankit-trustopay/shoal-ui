export const LIVE_CONSOLE_MOCK = {
  statusLabel: 'CONSENSUS REACHED',
  premise:
    'Should we acquire Northwind Robotics at the $480M valuation, or wait for Q3 renewal proof?',
  managerVerdict:
    'Do not close at $480M today. The swarm recommends a structured option: $420M base with $60M in performance-linked earn-out tied to net revenue retention above 115% by Q3.',
  stats: {
    agents: 50,
    sources: 5,
    runtimeSec: 240,
    costCredits: 22,
  },
  confidence: 87,
  agreementPercent: 56,
  votes: {
    for: 28,
    against: 10,
    neutral: 12,
  },
  recommendedActions: [
    {
      step: 1,
      title: 'Request Q3 enterprise renewal cohort data',
      body: 'Before signing, require a customer-level renewal schedule for the top 10 accounts representing 61% of ARR.',
    },
    {
      step: 2,
      title: 'Re-price with contingent consideration',
      body: 'Counter at $420M upfront plus earn-out triggers; cap total consideration at $480M only if NRR exceeds 115%.',
    },
  ],
  minorityDissent:
    'Ten agents argued for immediate acquisition at $480M, citing competitive timing risk: a strategic bidder could force a 15–20% premium within 60 days if Northwind’s core patent stack renews cleanly in 2027.',
  evidence: [
    {
      id: 'ev-1',
      source: 'PitchBook',
      title: 'Northwind Robotics — Comparable M&A Multiples',
      excerpt: 'Median EV/Revenue for industrial automation deals (2024–2025): 8.4×.',
      url: 'https://pitchbook.com',
    },
    {
      id: 'ev-2',
      source: 'First Round Review',
      title: 'How to Structure Earn-Outs That Actually Work',
      excerpt: 'Performance tranches tied to NRR outperform revenue-only milestones by 2.1×.',
      url: 'https://review.firstround.com',
    },
    {
      id: 'ev-3',
      source: 'SEC EDGAR',
      title: 'Northwind S-1 / 10-Q Filing (Q3)',
      excerpt: 'Growth decelerated to 18% YoY; customer concentration disclosed at 61% ARR.',
      url: 'https://sec.gov',
    },
    {
      id: 'ev-4',
      source: 'USPTO',
      title: 'Patent Renewal Schedule — Core IP Stack',
      excerpt: '14 of 22 core assets renew before 2027; defensibility holds but timing matters.',
      url: 'https://uspto.gov',
    },
  ],
};

export type ConsoleTabId =
  | 'overview'
  | 'evidence'
  | 'agents'
  | 'debate'
  | 'cost';

export const CONSOLE_TABS: {
  id: ConsoleTabId;
  label: string;
  count?: number;
}[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'evidence', label: 'Evidence', count: 5 },
  { id: 'agents', label: 'Agents', count: 50 },
  { id: 'debate', label: 'Debate' },
  { id: 'cost', label: 'Cost' },
];
