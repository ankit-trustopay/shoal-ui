import React from 'react';
import { CheckIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { BentoCard } from '../components/ui/BentoCard';
import { MonoLabel } from '../components/ui/MonoLabel';
import { cn } from '../lib/cn';
import { headingCard } from '../lib/typography';
import { saasPlans } from '../data/creditsBilling';

export function Pricing() {
  return (
    <div>
      <PageHero
        kicker="Pricing"
        title="Intelligence-as-a-Service."
        description="Start on the Free Tier with 150 daily free credits. Upgrade to unlock larger swarms and monthly vault credit pools."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
        <div className="flex flex-col items-stretch gap-6 md:flex-row md:flex-wrap md:justify-center">
          {saasPlans.map((tier) => {
            const Icon = tier.icon;
            const isPopular = tier.highlight === 'popular';

            return (
              <div key={tier.id} className="relative w-full md:w-[22rem]">
                {isPopular && (
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
                    isPopular && 'border-axiom/50 shadow-bento-hover',
                  )}
                >
                  <div className="flex items-center justify-between mb-6">
                    <MonoLabel>{tier.name.toUpperCase()}</MonoLabel>
                    <Icon size={16} className="text-axiom" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl sm:text-5xl font-bold text-black tracking-tighter">
                      {tier.price}
                    </span>
                    <span className="text-sm text-gray-500">{tier.period}</span>
                  </div>
                  <p className="text-gray-600 mb-8">{tier.tagline}</p>
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
                  <Button
                    variant={isPopular ? 'primary' : 'secondary'}
                    fullWidth
                    href={tier.id === 'free' ? '/sign-up' : '/app/credits'}
                  >
                    {tier.id === 'free' ? 'Get Started' : `Choose ${tier.name}`}
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
          title="1 Virtual Human = 1 Credit."
          description="Running a 100-agent swarm costs exactly 100 credits. Running a 1,000-agent swarm costs exactly 1,000 credits. No hidden multipliers."
        />
        <BentoCard hover padding="lg" className="rounded-2xl">
          <h3 className={cn(headingCard, 'text-xl mb-2')}>Linear, predictable math</h3>
          <p className="text-gray-600">
            Free Tier includes 150 daily free credits. Paid tiers add monthly vault credits
            so you can run larger swarms without surprise bills.
          </p>
        </BentoCard>
      </section>
    </div>
  );
}
