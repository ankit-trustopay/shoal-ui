import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MonoLabel } from '../ui/MonoLabel';
import { cn } from '../../lib/cn';
import {
  billingTiers,
  type BillingTier,
  type SaasPlanId,
} from '../../data/creditsBilling';

interface PricingTierCardsProps {
  currentPlanId?: SaasPlanId;
  onUpgrade?: (tier: BillingTier) => void;
}

function tierCardClass(tier: BillingTier, isCurrent: boolean): string {
  if (isCurrent) {
    return 'border-2 border-orange-500 bg-orange-50/80 ring-1 ring-orange-500/20';
  }
  if (tier.highlight === 'enterprise') {
    return 'border border-gray-700 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl';
  }
  if (tier.highlight === 'popular') {
    return 'border-2 border-gray-900 bg-white shadow-bento-hover';
  }
  return 'border border-gray-200/80 bg-white shadow-bento hover:shadow-bento-hover';
}

export function PricingTierCards({
  currentPlanId = 'free',
  onUpgrade,
}: PricingTierCardsProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleUpgrade = (tier: BillingTier) => {
    if (tier.id === currentPlanId) return;
    setPendingId(tier.id);
    onUpgrade?.(tier);
    window.setTimeout(() => setPendingId(null), 600);
  };

  return (
    <section aria-labelledby="upgrade-plans-heading">
      <div className="mb-6 md:mb-8">
        <MonoLabel className="mb-2 block">Upgrade</MonoLabel>
        <h2
          id="upgrade-plans-heading"
          className="text-2xl md:text-3xl font-bold text-black tracking-tight"
        >
          Plans & virtual human limits
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl text-sm md:text-base">
          Scale from quick litmus tests to enterprise-scale swarms. Each tier unlocks
          more virtual humans per task and deeper profiling.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {billingTiers.map((tier) => {
          const Icon = tier.icon;
          const isCurrent = tier.id === currentPlanId;
          const isDark = tier.highlight === 'enterprise';
          const isPending = pendingId === tier.id;

          return (
            <motion.article
              key={tier.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'relative flex flex-col rounded-2xl p-5 md:p-6 transition-shadow',
                tierCardClass(tier, isCurrent),
              )}
            >
              {tier.highlight === 'popular' && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white bg-gray-900 px-3 py-1 rounded-full shadow-md">
                    Most popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-5 z-10">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white bg-orange-500 px-2.5 py-1 rounded">
                    Current plan
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    isDark ? 'bg-white/10 text-orange-400' : 'bg-gray-100 text-gray-900',
                  )}
                >
                  <Icon size={20} aria-hidden />
                </div>
                <MonoLabel
                  className={cn(
                    'text-right',
                    isDark ? 'text-gray-400' : 'text-gray-500',
                  )}
                >
                  {tier.maxAgentsPerTask.toLocaleString()} max agents
                </MonoLabel>
              </div>

              <h3
                className={cn(
                  'text-xl font-bold tracking-tight',
                  isDark ? 'text-white' : 'text-black',
                )}
              >
                {tier.name}
              </h3>
              <p
                className={cn(
                  'mt-1 text-xs leading-snug',
                  isDark ? 'text-gray-400' : 'text-gray-500',
                )}
              >
                {tier.tagline}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={cn(
                    'text-3xl font-bold tracking-tighter',
                    isDark ? 'text-white' : 'text-black',
                  )}
                >
                  {tier.price}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    isDark ? 'text-gray-500' : 'text-gray-500',
                  )}
                >
                  {tier.period}
                </span>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      'flex items-start gap-2 text-sm leading-snug',
                      isDark ? 'text-gray-300' : 'text-gray-700',
                    )}
                  >
                    <CheckIcon
                      size={14}
                      className={cn(
                        'mt-0.5 shrink-0',
                        isDark ? 'text-orange-400' : 'text-orange-500',
                      )}
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={isCurrent || isPending}
                onClick={() => handleUpgrade(tier)}
                className={cn(
                  'mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  isCurrent &&
                    'cursor-default bg-orange-100 text-orange-800 border border-orange-200',
                  !isCurrent &&
                    isDark &&
                    'bg-white text-gray-900 hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-white',
                  !isCurrent &&
                    !isDark &&
                    'bg-gray-900 text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg focus-visible:ring-gray-900',
                  isPending && 'opacity-70 cursor-wait',
                )}
              >
                {isCurrent
                  ? 'Current plan'
                  : isPending
                    ? 'Opening checkout…'
                    : `Upgrade to ${tier.name}`}
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
