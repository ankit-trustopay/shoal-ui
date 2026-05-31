export interface UseCaseItem {
  id: string;
  category: string;
  filter: string;
  title: string;
  description: string;
  highlights: string[];
}

export const useCaseFilters = [
  { id: 'all', label: 'All', count: 5 },
  { id: 'startups', label: 'Startups & Founders', count: 2 },
  { id: 'investing', label: 'Investing & VC', count: 1 },
  { id: 'marketing', label: 'Marketing & Growth', count: 1 },
  { id: 'product', label: 'Product & UX', count: 1 },
  { id: 'research', label: 'Research & Strategy', count: 0 },
];

export const useCases: UseCaseItem[] = [
  {
    id: 'UC-001',
    category: 'STARTUPS & FOUNDERS',
    filter: 'startups',
    title: 'Pitch deck pressure test',
    description:
      'Deploy 500 synthetic VCs programmed on the 12 Vectors of Humanity. Agent SH-014 (Financial Skeptic) surfaces the three slides that statistically kill your round — with cited objections, not opinions.',
    highlights: [
      'Per-slide kill-rate scoring from adversarial investors',
      'Transcript of every challenge, preserved for your data room',
      'Consensus on whether to lead with traction or TAM',
    ],
  },
  {
    id: 'UC-002',
    category: 'MARKETING & GROWTH',
    filter: 'marketing',
    title: 'Pre-launch naming',
    description:
      'Before you commit to a brand, Shoal AI runs demographic recall, trademark collision, and category-fit swarms. Friction between creative and legal personas produces a defensible name shortlist.',
    highlights: [
      'Trademark and phonetic collision scan across 40 markets',
      'Synthetic buyer panels with budget and loyalty bias',
      'Minority dissent preserved when a name polarizes',
    ],
  },
  {
    id: 'UC-003',
    category: 'STARTUPS & FOUNDERS',
    filter: 'startups',
    title: 'Pivot vs persevere',
    description:
      'Quantify kill, pivot, or double-down with a swarm that has no sunk-cost bias. Managers weight evidence; Skeptics attack your remaining runway math.',
    highlights: [
      'Scenario matrix with cited market and churn data',
      'Unanimity score vs preserved dissent on tail risks',
      'Board-ready memo from Shoal AI in under four minutes',
    ],
  },
  {
    id: 'UC-004',
    category: 'PRODUCT & UX',
    filter: 'product',
    title: 'MVP scoping',
    description:
      'Identify the smallest defensible surface area. Consumer Voice and Domain Expert agents debate which features survive cross-examination — noise gets cut with citations.',
    highlights: [
      'Feature stack ranked by adversarial impact, not votes',
      'Explicit list of features the swarm proved were noise',
      'Defensible MVP boundary for engineering planning',
    ],
  },
  {
    id: 'UC-005',
    category: 'INVESTING & VC',
    filter: 'investing',
    title: 'M&A valuation dossier',
    description:
      'Run a full M&A diligence swarm: 1,000 agents scrape filings, press, and forums, then debate until consensus on price, timing, and risk. Built for IC memos and live deal committees.',
    highlights: [
      'Signal vs friction split in every synthesis report',
      'Live transcript with agent IDs (e.g. AX-014)',
      'Exportable boardroom PDF with source map',
    ],
  },
];
