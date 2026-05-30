import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from 'lucide-react';
import {
  settingsPlans,
  CURRENT_PLAN_ID,
  type SettingsPlan,
} from '../../data/settings';
import { cn } from '../../lib/cn';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';

export function SettingsPlansPanel() {
  return (
    <div>
      <BentoCard className="p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <MonoLabel className="mb-1 block">Current Plan</MonoLabel>
          <div className="text-2xl font-bold text-black tracking-tight">Starter</div>
          <div className="text-sm text-gray-600 mt-1">
            $20/month · Renews on Jun 1, 2026
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
        Upgrade or downgrade anytime. Bonus credits roll over.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

  return (
    <BentoCard
      className={cn(
        'p-6 flex flex-col relative',
        isCurrent && '!border-2 !border-axiom',
        !isCurrent && plan.recommended && 'border-axiom/50',
      )}
    >
      {isCurrent && (
        <div className="absolute top-4 right-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Current
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-axiom" />
        <MonoLabel>{plan.name}</MonoLabel>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold text-black tracking-tighter">
          {plan.price}
        </span>
        <span className="text-sm text-gray-500">{plan.period}</span>
      </div>
      <p className="text-sm text-gray-600 mb-5">{plan.description}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckIcon size={14} className="text-axiom shrink-0 mt-1" />
            <span>{f}</span>
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
          : plan.id === 'lite'
            ? 'Downgrade'
            : `Upgrade to ${plan.name}`}
      </button>
    </BentoCard>
  );
}
