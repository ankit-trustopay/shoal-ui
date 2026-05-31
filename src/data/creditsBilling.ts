import {
  Building2Icon,
  CrownIcon,
  RocketIcon,
  ZapIcon,
  type LucideIcon,
} from 'lucide-react';

/** Mock Free-tier wallet balance */
export const FREE_TIER_AVAILABLE_CREDITS = 10;

/** Daily allowance on Free tier */
export const DAILY_FREE_CREDITS_TOTAL = 10;

export const CURRENT_BILLING_PLAN_ID = 'free';

export interface BillingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  icon: LucideIcon;
  tagline: string;
  features: string[];
  maxVirtualHumans: number;
  highlight?: 'popular' | 'enterprise';
}

export const billingTiers: BillingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/mo',
    icon: ZapIcon,
    tagline: 'Explore the consensus engine',
    maxVirtualHumans: 5,
    features: [
      'Up to 5 Virtual Humans per task',
      '10 Daily Credits',
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
    maxVirtualHumans: 100,
    features: [
      'Up to 100 Virtual Humans per task',
      'Priority processing',
      'Deeper archetype leader profiles',
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
    maxVirtualHumans: 1000,
    features: [
      'Up to 1,000 Virtual Humans per task',
      'Deep demographic profiling',
      'Priority compute routing',
      'PDF & share exports',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$500',
    period: '/mo',
    icon: Building2Icon,
    tagline: 'Institutional scale & API access',
    maxVirtualHumans: 10000,
    features: [
      'Up to 10,000 Virtual Humans per task',
      'API Access',
      'Dedicated account manager',
      'Custom compliance & SSO',
    ],
    highlight: 'enterprise',
  },
];

export interface CreditTopUpPack {
  id: string;
  credits: number;
  price: number;
  label: string;
}

export const creditTopUpPacks: CreditTopUpPack[] = [
  { id: 'pack-50', credits: 50, price: 25, label: 'Starter top-up' },
  { id: 'pack-200', credits: 200, price: 89, label: 'Team top-up' },
  { id: 'pack-1000', credits: 1000, price: 399, label: 'Scale top-up' },
];
