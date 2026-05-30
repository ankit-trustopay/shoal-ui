import {
  ZapIcon,
  RocketIcon,
  CrownIcon,
  Building2Icon,
  type LucideIcon,
} from 'lucide-react';

export const settingsTabs = [
  { id: 'plans', label: 'Plans' },
  { id: 'profile', label: 'Profile' },
  { id: 'billing', label: 'Billing & Usage' },
] as const;

export type SettingsTabId = (typeof settingsTabs)[number]['id'];

export interface SettingsPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  icon: LucideIcon;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const settingsPlans: SettingsPlan[] = [
  {
    id: 'lite',
    name: 'Lite',
    price: '$0',
    period: '/month',
    icon: ZapIcon,
    description: 'Try the consensus engine. No card required.',
    features: [
      '5 free swarm runs daily',
      'Lite swarm tier · up to 50 agents',
      'Full debate transcripts',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$20',
    period: '/month',
    icon: RocketIcon,
    description: 'For individuals and side projects.',
    features: [
      '5 free swarm runs daily',
      '+100 bonus credits monthly',
      'Lite + Starter swarms · up to 200 agents',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$100',
    period: '/month',
    icon: CrownIcon,
    description: 'For founders, operators, small teams.',
    features: [
      '5 free swarm runs daily',
      '+1,000 bonus credits monthly',
      'Lite + Starter + Pro swarms',
      'Up to 1,000 agents · PDF exports',
      'Priority compute routing',
    ],
    recommended: true,
  },
  {
    id: 'max',
    name: 'Max',
    price: '$500',
    period: '/month',
    icon: Building2Icon,
    description: 'For VC firms and enterprise simulations.',
    features: [
      '5 free swarm runs daily',
      '+10,000 bonus credits monthly',
      'All swarms unlocked',
      'Up to 10,000 agents · API access',
      'Dedicated account manager',
    ],
  },
];

export const CURRENT_PLAN_ID = 'starter';

export const settingsInvoices = [
  { id: 'inv-may', date: 'May 1, 2026', plan: 'Starter Plan', amount: '$20.00', status: 'PAID' },
  { id: 'inv-apr', date: 'Apr 1, 2026', plan: 'Starter Plan', amount: '$20.00', status: 'PAID' },
  { id: 'inv-mar', date: 'Mar 1, 2026', plan: 'Starter Plan', amount: '$20.00', status: 'PAID' },
];
