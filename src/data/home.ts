import {
  ShieldAlertIcon,
  TelescopeIcon,
  FileSearchIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react';

export const homeAgents = [
  {
    id: 'SH-014',
    name: 'Financial Skeptic',
    action: 'Challenging $480M multiple vs Q3 filings',
  },
  { id: 'SH-029', name: 'Domain Expert', action: 'Citing USPTO patent renewals' },
  { id: 'SH-041', name: 'Risk Analyst', action: 'Modeling 61% ARR concentration' },
  { id: 'SH-058', name: 'Manager', action: 'Synthesizing WAIT signal' },
  { id: 'SH-072', name: 'Consumer Voice', action: 'NPS 74→58 corroboration' },
  { id: 'SH-091', name: 'Verifier', action: 'Cross-checking 412 sources' },
];

export const homeStats = [
  { id: 'stat-voters', value: '127', label: 'AI voters', sublabel: '' },
  { id: 'stat-sources', value: '412', label: 'live web', sublabel: 'SOURCES CITED' },
  { id: 'stat-rounds', value: '07', label: 'of debate', sublabel: 'ROUNDS' },
  { id: 'stat-dissent', value: '11', label: 'preserved', sublabel: 'DISSENT' },
];

export const comparisons = [
  {
    id: 'compare-search',
    letter: 'Q',
    title: 'Search engines',
    text: "Index yesterday's links, ranked by ad spend.",
  },
  {
    id: 'compare-ai',
    letter: 'M',
    title: 'Standard AI',
    text: 'One model. Polite hallucinations dressed as analysis.',
  },
  {
    id: 'compare-shoal',
    letter: 'SH',
    title: 'Shoal AI',
    text: 'Swarms that argue, cite, and converge on the proven answer.',
  },
];

export const partners = [
  'KINETIC CAPITAL',
  'ORBITAL VENTURES',
  'NEURAL FOUNDRY',
  'SYNTAX PARTNERS',
];

export const archetypes: {
  id: string;
  name: string;
  icon: LucideIcon;
  accent: 'rose' | 'blue' | 'gray' | 'emerald';
  tag: string;
  text: string;
}[] = [
  {
    id: 'arch-skeptic',
    name: 'The Skeptic',
    icon: ShieldAlertIcon,
    accent: 'rose',
    tag: '/ ADVERSARIAL',
    text: 'Finds the fatal flaw in your unit economics.',
  },
  {
    id: 'arch-visionary',
    name: 'The Visionary',
    icon: TelescopeIcon,
    accent: 'blue',
    tag: '/ STRATEGIC',
    text: 'Models 5-year market expansion and platform dynamics.',
  },
  {
    id: 'arch-auditor',
    name: 'The Auditor',
    icon: FileSearchIcon,
    accent: 'gray',
    tag: '/ EVIDENCE',
    text: 'Cross-references every claim against SEC filings and live sources.',
  },
  {
    id: 'arch-consumer',
    name: 'The Consumer',
    icon: UsersIcon,
    accent: 'emerald',
    tag: '/ MARKET',
    text: 'Evaluates brand friction, churn risk, and real buyer behavior.',
  },
];

export const impactMetrics = [
  {
    id: 'impact-hallucination',
    value: '99.9%',
    label: 'Hallucination rate eliminated',
    sub: 'Verified by cross-citation across every agent.',
    highlight: true,
  },
  {
    id: 'impact-sources',
    value: '400+',
    label: 'Live sources scraped per minute',
    sub: 'Real-time web research, not stale training data.',
    highlight: false,
  },
  {
    id: 'impact-speed',
    value: '120×',
    label: 'Faster than traditional due diligence',
    sub: 'A boardroom-grade verdict in under four minutes.',
    highlight: false,
  },
];
