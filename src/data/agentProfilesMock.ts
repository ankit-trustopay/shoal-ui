export interface AgentProfile {
  id: number;
  name: string;
  role: string;
  age: number;
  location: string;
  income: string;
  iq: number;
  eq: number;
  riskTolerance: 'Low' | 'Medium' | 'High';
  biases: string;
  backstory: string;
}

export const AGENT_PROFILES: AgentProfile[] = [
  {
    id: 1,
    name: 'Rajesh K.',
    role: 'Budget-Conscious Buyer',
    age: 34,
    location: 'Tier-2 City, India',
    income: '₹8L/year',
    iq: 110,
    eq: 130,
    riskTolerance: 'Low',
    biases:
      'Highly skeptical of marketing hype. Prioritizes longevity and resale value.',
    backstory:
      'Father of two, works in mid-level IT. He spends weeks researching on YouTube before making any purchase over ₹1,000.',
  },
  {
    id: 2,
    name: 'Marcus L.',
    role: 'Performance Enthusiast',
    age: 29,
    location: 'Austin, TX',
    income: '$145K/year',
    iq: 125,
    eq: 95,
    riskTolerance: 'High',
    biases:
      'Believes specs win arguments. Over-indexes on benchmark scores and early-adopter reviews.',
    backstory:
      'Product manager at a SaaS startup who upgrades his setup every 18 months. Treats every decision like a competitive benchmark.',
  },
  {
    id: 3,
    name: 'Priya S.',
    role: 'Safety & Practicality Parent',
    age: 41,
    location: 'Suburban Chicago, IL',
    income: '$92K/year',
    iq: 118,
    eq: 142,
    riskTolerance: 'Low',
    biases:
      'Defaults to worst-case scenarios. Trusts institutional ratings over influencer opinions.',
    backstory:
      'Nurse and part-time school volunteer with two teenagers. Every purchase is filtered through safety, reliability, and total cost of ownership.',
  },
  {
    id: 4,
    name: 'Arjun M.',
    role: 'Brand Status Fanboy',
    age: 27,
    location: 'Mumbai, India',
    income: '₹18L/year',
    iq: 108,
    eq: 115,
    riskTolerance: 'Medium',
    biases:
      'Equates premium brands with social proof. Sensitive to how choices look to peers and clients.',
    backstory:
      'Luxury retail associate who curates his personal brand on LinkedIn. Will pay more if the narrative feels prestigious and shareable.',
  },
  {
    id: 5,
    name: 'David C.',
    role: 'Skeptical Mechanic',
    age: 52,
    location: 'Detroit, MI',
    income: '$68K/year',
    iq: 132,
    eq: 88,
    riskTolerance: 'Low',
    biases:
      'Assumes hidden defects exist until disproven. Distrusts polished decks and vendor claims.',
    backstory:
      '30-year automotive technician who has seen every recall wave. Reads fine print, searches forums, and stress-tests promises against field reality.',
  },
];

export function riskTolerancePercent(level: AgentProfile['riskTolerance']): number {
  switch (level) {
    case 'Low':
      return 28;
    case 'Medium':
      return 58;
    case 'High':
      return 88;
    default:
      return 50;
  }
}
