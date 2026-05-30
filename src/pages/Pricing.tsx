import React from 'react';
import { CheckIcon, ZapIcon, RocketIcon, CrownIcon, Building2Icon } from 'lucide-react';
import { Button } from '../components/Button';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BentoCard } from '../components/ui/BentoCard';
import { MonoLabel } from '../components/ui/MonoLabel';
import { cn } from '../lib/cn';
import { headingCard } from '../lib/typography';

const tiers = [
  {
    id: 'lite',
    name: 'LITE',
    price: '$0',
    period: '/month',
    icon: ZapIcon,
    description: 'Try the consensus engine. No card required.',
    features: [
      '5 free swarm runs daily',
      'Lite swarm tier · up to 50 agents',
      'Full debate transcripts',
      'Community support',
    ],
    cta: 'Get Started',
    ctaVariant: 'secondary' as const,
    popular: false,
  },
  {
    id: 'starter',
    name: 'STARTER',
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
    cta: 'Choose Starter',
    ctaVariant: 'secondary' as const,
    popular: false,
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '$100',
    period: '/month',
    icon: CrownIcon,
    description: 'For founders, operators, and small teams.',
    features: [
      '5 free swarm runs daily',
      '+1,000 bonus credits monthly',
      'Lite + Starter + Pro swarms · up to 1,000 agents',
      'Boardroom-ready PDF exports',
      'Priority compute routing',
    ],
    cta: 'Choose Pro',
    ctaVariant: 'primary' as const,
    popular: true,
  },
  {
    id: 'max',
    name: 'MAX',
    price: '$500',
    period: '/month',
    icon: Building2Icon,
    description: 'For VC firms and enterprise simulations.',
    features: [
      '5 free swarm runs daily',
      '+10,000 bonus credits monthly',
      'All swarms unlocked · up to 10,000 agents',
      'Priority API access',
      'Dedicated account manager',
    ],
    cta: 'Choose Max',
    ctaVariant: 'secondary' as const,
    popular: false,
  },
];

const creditsExplainer = [
  {
    id: 'credit-search',
    title: 'Browser search',
    text: 'Live web research and citation per agent.',
  },
  {
    id: 'credit-debate',
    title: 'Debate round',
    text: 'Each adversarial exchange between agents.',
  },
  {
    id: 'credit-synthesis',
    title: 'Synthesis',
    text: 'Manager AI compiles the final verdict.',
  },
];

export function Pricing() {
  return (
    <div>
      <PageHero
        kicker="Pricing"
        title="Intelligence-as-a-Service."
        description="Every plan ships with 5 free swarm runs daily. Upgrade to unlock larger swarms, deeper adversarial debate, and bonus credits."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.id} className="relative">
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-white border border-axiom/60 px-4 py-1 rounded-full shadow-bento">
                      <MonoLabel variant="accent">Most Popular</MonoLabel>
                    </div>
                  </div>
                )}
                <BentoCard
                  hover
                  padding="lg"
                  className={cn(
                    'h-full flex flex-col rounded-2xl',
                    tier.popular && 'border-axiom/50 shadow-bento-hover',
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <MonoLabel>{tier.name}</MonoLabel>
                    <Icon size={16} className="text-axiom" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl sm:text-5xl font-bold text-black tracking-tighter">
                      {tier.price}
                    </span>
                    <span className="text-sm text-gray-500">{tier.period}</span>
                  </div>
                  <p className="text-gray-600 mb-8">{tier.description}</p>
                  <ul className="space-y-3 mb-10 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckIcon
                          size={18}
                          className="text-axiom shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={tier.ctaVariant} fullWidth>
                    {tier.cta}
                  </Button>
                </BentoCard>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          kicker="How Credits Work"
          title="Every credit buys digital labor."
          description="Daily runs are free. Bonus credits cover deeper swarms — web search, adversarial debate, and final synthesis all draw from the same balance."
        />
        <div className="space-y-4">
          {creditsExplainer.map((credit) => (
            <BentoCard key={credit.id} hover padding="lg" className="rounded-2xl">
              <h3 className={cn(headingCard, 'text-xl mb-2')}>{credit.title}</h3>
              <p className="text-gray-600">{credit.text}</p>
            </BentoCard>
          ))}
        </div>
      </section>
    </div>
  );
}
