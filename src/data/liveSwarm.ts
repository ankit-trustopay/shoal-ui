export type DebateTag =
  | 'CHALLENGING PREMISE'
  | 'CITING SOURCE'
  | 'AGREEMENT'
  | 'COUNTER-ARGUMENT'
  | 'SYNTHESIS';

export interface DebateMessage {
  id: string;
  persona: string;
  timestamp: string;
  tag: DebateTag;
  body: string;
}

export const LIVE_SESSION = {
  id: 'SH-992-02',
  title: 'Should we acquire Northwind Robotics at the $480M valuation?',
  round: 4,
  totalRounds: 7,
  startedAt: '12:00:42 PM',
  elapsed: '4m 12s',
};

export const activePersonas = [
  'Financial Skeptic',
  'Domain Expert',
  'Risk Analyst',
  'Consumer Voice',
  'Manager',
  'Verifier',
];

export const debateMessages: DebateMessage[] = [
  {
    id: 'AX-014',
    persona: 'Financial Skeptic',
    timestamp: '12:04:11:02',
    tag: 'CHALLENGING PREMISE',
    body: 'Agent AX-014 (Financial Skeptic) challenges the $480M valuation: it implies a 12× forward revenue multiple while Q3 SEC filings show growth decelerated to 18% YoY. This multiple is unjustified without renewal proof.',
  },
  {
    id: 'AX-029',
    persona: 'Domain Expert',
    timestamp: '12:04:18:41',
    tag: 'CITING SOURCE',
    body: "Cross-referencing Northwind's patent portfolio (USPTO filings 2023–Q2 2026). 14 of 22 core IP assets renew before 2027. Technical defensibility holds — but does not justify price at this growth rate.",
  },
  {
    id: 'AX-041',
    persona: 'Risk Analyst',
    timestamp: '12:04:24:17',
    tag: 'COUNTER-ARGUMENT',
    body: 'Patent defensibility ignores enterprise concentration: top 3 customers = 61% of ARR. A single churn event collapses the DCF. Shoal AI recommends waiting two quarters to observe renewal outcomes before any close.',
  },
  {
    id: 'AX-072',
    persona: 'Consumer Voice',
    timestamp: '12:04:31:08',
    tag: 'AGREEMENT',
    body: 'Public sentiment and buyer forums show NPS declined 74 → 58 in Q3. Customer voice corroborates Risk Analyst — renewal probability is the unresolved variable in this dossier.',
  },
  {
    id: 'AX-058',
    persona: 'Manager',
    timestamp: '12:04:38:55',
    tag: 'SYNTHESIS',
    body: 'Two converging signals: revenue-multiple dispute (Skeptic, Risk) and renewal-window uncertainty (Risk, Consumer). Routing to Verifier for citation pass before Round 5. Consensus probability trending to WAIT.',
  },
  {
    id: 'AX-091',
    persona: 'Verifier',
    timestamp: '12:04:45:22',
    tag: 'CITING SOURCE',
    body: 'Validated 38 live sources against SEC EDGAR and USPTO. Growth deceleration claim holds (18% YoY, Q3). Patent renewal schedule confirmed. Discarding 12 arguments that failed cross-examination.',
  },
];

export const swarmTelemetry = [
  {
    id: 'tel-sources',
    label: 'Sources Scraped',
    value: '412',
    subtext: '+38 this round · Shoal web crawl',
    accent: false,
  },
  {
    id: 'tel-discarded',
    label: 'Arguments Discarded',
    value: '89',
    subtext: 'Failed adversarial cross-exam',
    accent: false,
  },
  {
    id: 'tel-consensus',
    label: 'Consensus Probability',
    value: '64%',
    subtext: 'Signal: WAIT · trending up',
    accent: true,
  },
];
