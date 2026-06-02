import { CrownIcon, RocketIcon, ZapIcon, type LucideIcon } from 'lucide-react';

/** Mock wallet balance until backend billing is wired */
export const FREE_TIER_AVAILABLE_CREDITS = 150;

/** Daily allowance on Free tier */
export const DAILY_FREE_CREDITS_TOTAL = 150;

export const FREE_TIER_PLAN_LABEL = 'Free Tier';
export const FREE_TIER_SIDEBAR_LABEL = 'Free Plan';

export type SaasPlanId = 'free' | 'pro' | 'max';

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
    period: '/ mo',
    icon: ZapIcon,
    tagline: 'Up to 50 Agents. 150 Daily Free Credits.',
    maxAgentsPerTask: 50,
    creditAllowance: '150 Daily Free Credits',
    features: [
      'Up to 50 Agents per task',
      '150 Daily Free Credits',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    period: '/ mo',
    icon: RocketIcon,
    tagline: 'Up to 1,000 Agents. 10,000 Monthly Vault Credits.',
    maxAgentsPerTask: 1000,
    creditAllowance: '10,000 Monthly Vault Credits',
    features: [
      'Up to 1,000 Agents per task',
      '10,000 Monthly Vault Credits',
    ],
    highlight: 'popular',
  },
  {
    id: 'max',
    name: 'Max',
    price: '$249',
    period: '/ mo',
    icon: CrownIcon,
    tagline: 'Up to 10,000 Agents. 75,000 Monthly Vault Credits.',
    maxAgentsPerTask: 10000,
    creditAllowance: '75,000 Monthly Vault Credits',
    features: [
      'Up to 10,000 Agents per task',
      '75,000 Monthly Vault Credits',
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
