import React from 'react';
import { CoinsIcon, SparklesIcon } from 'lucide-react';
import { CountUp } from '../motion/CountUp';
import { MonoLabel } from '../ui/MonoLabel';
import {
  DAILY_FREE_CREDITS_TOTAL,
  FREE_TIER_AVAILABLE_CREDITS,
} from '../../data/creditsBilling';

interface CreditsBalanceHeroProps {
  balance?: number;
  dailyUsed?: number;
  onBuyExtra: () => void;
}

export function CreditsBalanceHero({
  balance = FREE_TIER_AVAILABLE_CREDITS,
  dailyUsed = 0,
  onBuyExtra,
}: CreditsBalanceHeroProps) {
  const dailyRemaining = Math.max(0, DAILY_FREE_CREDITS_TOTAL - dailyUsed);
  const dailyPct =
    DAILY_FREE_CREDITS_TOTAL > 0
      ? Math.round((dailyRemaining / DAILY_FREE_CREDITS_TOTAL) * 100)
      : 0;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-900 bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6 sm:p-8 md:p-10 shadow-bento">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <MonoLabel className="mb-4 flex items-center gap-2 text-orange-400/90">
            <CoinsIcon size={12} aria-hidden />
            Current balance
          </MonoLabel>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter leading-none tabular-nums">
              <CountUp value={balance} duration={0.7} />
            </span>
            <span className="text-lg sm:text-xl font-medium text-gray-400">
              Credits
            </span>
          </div>

          <p className="mt-4 max-w-lg text-sm text-gray-400 leading-relaxed">
            Free tier wallet — simulated at{' '}
            <span className="font-semibold text-gray-200">
              {FREE_TIER_AVAILABLE_CREDITS} credits
            </span>
            . Swarm runs draw credits at 1 credit per 100 virtual humans deployed.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <SparklesIcon size={16} className="text-orange-400 shrink-0" aria-hidden />
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Daily free credits
              </p>
              <p className="text-sm font-semibold text-white tabular-nums">
                {dailyRemaining}/{DAILY_FREE_CREDITS_TOTAL}
                <span className="ml-2 font-normal text-gray-400">remaining today</span>
              </p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-white/10" aria-hidden />
            <div className="hidden sm:block min-w-[120px]">
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                  style={{ width: `${dailyPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBuyExtra}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-400 hover:shadow-orange-400/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
        >
          <CoinsIcon size={16} aria-hidden />
          Buy Extra Credits
        </button>
      </div>
    </section>
  );
}
