/** Shoal AI synthesis report — sample M&A diligence dossier */

export const reportTelemetry = [
  { label: 'Agents Deployed', value: '1,000' },
  { label: 'Sources Scraped', value: '4,102' },
  { label: 'Debate Rounds', value: '14' },
  { label: 'Compute Cost', value: '$0.42' },
];

export const radarData = [
  { vector: 'Budget Constraints', value: 78 },
  { vector: 'Tech Literacy', value: 91 },
  { vector: 'Risk Tolerance', value: 64 },
  { vector: 'Skepticism', value: 82 },
  { vector: 'Brand Loyalty', value: 56 },
  { vector: 'Time Horizon', value: 73 },
];

export const winningThesis = [
  {
    id: 'thesis-1',
    agent: 'AX-014 · Financial Skeptic',
    text: 'The $480M valuation implies a 12× forward revenue multiple against Q3 filings showing growth decelerated to 18% YoY. At this multiple, the deal fails Shoal’s capital-efficiency hurdle — wait two quarters for renewal signal.',
    citations: 142,
  },
  {
    id: 'thesis-2',
    agent: 'AX-041 · Risk Analyst',
    text: 'Top-three customers represent 61% of ARR. One enterprise churn event reprices the asset 30–40% lower. Delaying close until Q3 renewals land is the dominant risk-adjusted path.',
    citations: 98,
  },
  {
    id: 'thesis-3',
    agent: 'AX-072 · Consumer Voice',
    text: 'NPS fell 74 → 58 across public forums in Q3. Buyer sentiment corroborates renewal-window uncertainty — acquiring before that signal resolves embeds goodwill risk into purchase price.',
    citations: 76,
  },
];

export const minorityDissent = [
  {
    id: 'dissent-1',
    agent: 'AX-029 · Domain Expert',
    text: 'The target’s core patent stack (14 of 22 assets) renews before 2027. A strategic acquirer bidding in 60 days could force a 15–20% premium to our model — waiting carries competitive timing risk.',
    citations: 31,
  },
  {
    id: 'dissent-2',
    agent: 'AX-058 · Manager',
    text: 'Integration synergies with our logistics stack are modeled at $42M NPV over 36 months. Minority holds that passing at $480M forfeits a once-per-cycle asset in industrial automation.',
    citations: 24,
  },
];

export const marketImpact = [
  {
    id: 'impact-valuation',
    label: 'Implied Multiple Compression',
    value: '−2.1×',
    sub: 'If Q3 renewals miss plan by >10%',
    accent: 'rose' as const,
  },
  {
    id: 'impact-timing',
    label: 'Strategic Bid Window',
    value: '60 Days',
    sub: 'Modeled competitor acquisition probability',
    accent: 'orange' as const,
  },
  {
    id: 'impact-synergy',
    label: 'Synergy Capture (if wait)',
    value: '+$42M',
    sub: 'NPV preserved by improved diligence terms',
    accent: 'emerald' as const,
  },
];

export const reportSources = [
  {
    id: 'src-sec',
    letter: 'S',
    name: 'SEC EDGAR — Target S-1 / 10-Q (Q3 2025)',
    domain: 'sec.gov',
    citations: 52,
    href: 'https://www.sec.gov',
  },
  {
    id: 'src-uspto',
    letter: 'P',
    name: 'USPTO — Patent renewal schedule 2023–Q2 2026',
    domain: 'uspto.gov',
    citations: 38,
    href: 'https://www.uspto.gov',
  },
  {
    id: 'src-pitchbook',
    letter: 'B',
    name: 'PitchBook — Industrial Robotics M&A Comps (2024–2026)',
    domain: 'pitchbook.com',
    citations: 41,
    href: 'https://pitchbook.com',
  },
  {
    id: 'src-gartner',
    letter: 'G',
    name: 'Gartner — Warehouse Automation TAM & NPS benchmarks',
    domain: 'gartner.com',
    citations: 29,
    href: 'https://www.gartner.com',
  },
];

export const reportFooterStats = [
  { id: 'stat-agents', label: 'Agents', value: '1,000' },
  { id: 'stat-sources', label: 'Sources', value: '4,102' },
  { id: 'stat-runtime', label: 'Runtime', value: '4m 12s' },
  { id: 'stat-compute', label: 'Compute', value: '$0.42' },
];

export const REPORT_META = {
  id: 'SH-992-02',
  confidence: 87,
  verdict:
    'Do not acquire at $480M. Wait two quarters for enterprise renewal signal and revised unit economics.',
  summary:
    'After 14 debate rounds, 1,000 Shoal AI agents converged: the $480M price embeds a growth multiple the filings no longer support. The winning signal is temporal — surface Q3 renewal outcomes before re-engaging. Minority dissent preserves strategic-timing risk if a rival bidder moves within 60 days.',
  question:
    'Should we acquire the target at the proposed $480M valuation?',
};
