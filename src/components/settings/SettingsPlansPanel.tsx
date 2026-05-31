import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import {
  settingsPlans,
  CURRENT_PLAN_ID,
  getCurrentPlan,
  type SettingsPlan,
} from '../../data/settings';
import { FREE_TIER_PLAN_LABEL } from '../../data/creditsBilling';
import { cn } from '../../lib/cn';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';

export function SettingsPlansPanel() {
  const current = getCurrentPlan();

  return (
    <div>
      <BentoCard className="p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <MonoLabel className="mb-1 block">Current plan</MonoLabel>
          <div className="text-2xl font-bold text-black tracking-tight">
            {current.id === 'free' ? FREE_TIER_PLAN_LABEL : current.name}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {current.price}
            {current.period}
            {current.id === 'free'
              ? ' · No renewal required'
              : ' · Billing connects at checkout'}
          </div>
        </div>
        <Link
          to="/app/credits"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-black border border-gray-200/60 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap text-center"
        >
          Buy credits
        </Link>
      </BentoCard>

      <h2 className="text-xl font-bold text-black tracking-tight mb-1">
        Compare plans
      </h2>
      <p className="text-gray-600 mb-6">
        Upgrade when you need more virtual humans per task or monthly credits.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {settingsPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: SettingsPlan }) {
  const Icon = plan.icon;
  const isCurrent = plan.id === CURRENT_PLAN_ID;
  const planRank: Record<SettingsPlan['id'], number> = {
    free: 0,
    pro: 1,
    business: 2,
    enterprise: 3,
  };
  const isUpgrade = planRank[plan.id] > planRank[CURRENT_PLAN_ID];

  return (
    <BentoCard
      className={cn(
        'p-5 flex flex-col relative',
        isCurrent && '!border-2 !border-axiom',
        !isCurrent && plan.highlight === 'popular' && 'border-orange-200',
      )}
    >
      {isCurrent && (
        <div className="absolute top-4 right-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Current
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-axiom" />
        <MonoLabel>{plan.name}</MonoLabel>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-black tracking-tighter">
          {plan.price}
        </span>
        <span className="text-sm text-gray-500">{plan.period}</span>
      </div>
      <p className="text-xs text-gray-600 mb-4 leading-snug">{plan.tagline}</p>
      <ul className="space-y-2 mb-5 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckIcon size={14} className="text-axiom shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={isCurrent}
        className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
          isCurrent
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-axiom text-white hover:bg-orange-600'
        }`}
      >
        {isCurrent
          ? 'Current plan'
          : isUpgrade
            ? `Upgrade to ${plan.name}`
            : 'Contact support'}
      </button>
    </BentoCard>
  );
}
