import {
  Building2Icon,
  CrownIcon,
  RocketIcon,
  ZapIcon,
  type LucideIcon,
} from 'lucide-react';

/** Mock wallet balance until backend billing is wired */
export const FREE_TIER_AVAILABLE_CREDITS = 50;

/** Daily allowance on Free tier */
export const DAILY_FREE_CREDITS_TOTAL = 50;

export const FREE_TIER_PLAN_LABEL = 'Free Tier';
export const FREE_TIER_SIDEBAR_LABEL = 'Free Plan';

export type SaasPlanId = 'free' | 'pro' | 'business' | 'enterprise';

export const CURRENT_BILLING_PLAN_ID: SaasPlanId = 'free';

export interface SaasPlan {
  id: SaasPlanId;
  name: string;
  price: string;
  period: string;
  icon: LucideIcon;
  tagline: string;
  features: string[];
  maxAgentsPerTask: number;
  creditAllowance: string;
  highlight?: 'popular' | 'enterprise';
}

export const saasPlans: SaasPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/mo',
    icon: ZapIcon,
    tagline: 'Explore the consensus engine',
    maxAgentsPerTask: 5,
    creditAllowance: '50 Daily Credits',
    features: [
      '5 Agents per task',
      '50 Daily Credits',
      'Full debate transcripts',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20',
    period: '/mo',
    icon: RocketIcon,
    tagline: 'For operators shipping weekly decisions',
    maxAgentsPerTask: 100,
    creditAllowance: '10,000 Monthly Credits',
    features: [
      '100 Agents per task',
      '10,000 Monthly Credits',
      'Priority processing',
      'Email support',
    ],
    highlight: 'popular',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$100',
    period: '/mo',
    icon: CrownIcon,
    tagline: 'Boardroom-grade demographic simulation',
    maxAgentsPerTask: 1000,
    creditAllowance: '100,000 Monthly Credits',
    features: [
      '1,000 Agents per task',
      '100,000 Monthly Credits',
      'Deep demographic profiling',
      'Priority compute routing',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$500',
    period: '/mo',
    icon: Building2Icon,
    tagline: 'Institutional scale & API access',
    maxAgentsPerTask: 10000,
    creditAllowance: '2,000,000 Monthly Credits',
    features: [
      '10,000 Agents per task',
      '2,000,000 Monthly Credits',
      'API Access',
      'Dedicated account manager',
    ],
    highlight: 'enterprise',
  },
];

export function getCurrentSaasPlan(): SaasPlan {
  return (
    saasPlans.find((plan) => plan.id === CURRENT_BILLING_PLAN_ID) ?? saasPlans[0]
  );
}

export function getSaasPlanById(id: SaasPlanId): SaasPlan | undefined {
  return saasPlans.find((plan) => plan.id === id);
}

/** @deprecated Use saasPlans — kept for credits pricing cards */
export type BillingTier = SaasPlan;

export const billingTiers: SaasPlan[] = saasPlans;

export interface CreditTopUpPack {
  id: string;
  credits: number;
  price: number;
  label: string;
}

export const creditTopUpPacks: CreditTopUpPack[] = [
  { id: 'pack-50', credits: 50, price: 25, label: 'Quick top-up' },
  { id: 'pack-200', credits: 200, price: 89, label: 'Team top-up' },
  { id: 'pack-1000', credits: 1000, price: 399, label: 'Scale top-up' },
];
