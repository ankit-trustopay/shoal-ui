import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCardIcon } from 'lucide-react';
import { useUserAccount } from '../../hooks/useUserAccount';
import { formatPlanTierLabel } from '../../lib/planLabels';
import { saasPlans } from '../../data/creditsBilling';
import type { SettingsTabId } from '../../data/settings';
import { BentoCard } from '../ui/BentoCard';
import { MonoLabel } from '../ui/MonoLabel';

interface SettingsBillingPanelProps {
  onChangePlan: (tab: SettingsTabId) => void;
}

export function SettingsBillingPanel({ onChangePlan }: SettingsBillingPanelProps) {
  const { totalCredits, dailyCredits, vaultCredits, plan, planId, loading } =
    useUserAccount();
  const currentTier = saasPlans.find((tier) => tier.id === planId) ?? saasPlans[0];

  return (
    <div className="max-w-3xl">
      <BentoCard className="p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <MonoLabel className="mb-1 block">Current plan</MonoLabel>
          <div className="text-2xl font-bold text-black tracking-tight">
            {loading ? '…' : formatPlanTierLabel(plan)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {currentTier.price}
            {currentTier.period}
            {planId === 'free' ? ' · No paid subscription active' : ' · Active subscription'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChangePlan('plans')}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-black border border-gray-200/60 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          Compare plans
        </button>
      </BentoCard>

      <BentoCard className="p-6 mb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="font-bold text-black tracking-tight">Available credits</h2>
          <span className="font-mono text-sm text-gray-600 tabular-nums">
            <span className="text-black font-semibold">
              {loading ? '…' : totalCredits.toLocaleString()}
            </span>{' '}
            credits
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your ledger balance is synced from the database. Each virtual human in a
          swarm costs exactly 1 credit at ignition.
        </p>
        {!loading && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 px-4 py-3">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Daily free
              </div>
              <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-gray-900">
                {dailyCredits.toLocaleString()} credits
              </div>
            </div>
            <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 px-4 py-3">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Vault
              </div>
              <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-gray-900">
                {vaultCredits.toLocaleString()} credits
              </div>
            </div>
          </div>
        )}
        <Link
          to="/app/credits"
          className="inline-block mt-5 bg-axiom text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          View credits & usage
        </Link>
      </BentoCard>

      <BentoCard className="p-6 mb-6">
        <h2 className="font-bold text-black tracking-tight mb-1">Payment method</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add a card when you upgrade from the Free Plan.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-dashed border-gray-300 rounded-xl px-4 py-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <CreditCardIcon size={18} className="text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">
                No payment method on file
              </div>
              <div className="text-xs text-gray-500">Required for paid plans</div>
            </div>
          </div>
          <Link
            to="/app/credits"
            className="text-sm font-medium text-axiom hover:underline self-center"
          >
            Upgrade plan
          </Link>
        </div>
      </BentoCard>

      <BentoCard className="p-6">
        <h2 className="font-bold text-black tracking-tight mb-2">Invoice history</h2>
        <p className="text-sm text-gray-500">
          No invoices yet. Paid plans will show receipts here after checkout is
          connected.
        </p>
      </BentoCard>
    </div>
  );
}
