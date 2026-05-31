import React from 'react';
import { CoinsIcon } from 'lucide-react';
import { CountUp } from '../motion/CountUp';
import { MonoLabel } from '../ui/MonoLabel';

interface CreditsBalanceHeroProps {
  balance: number;
  planLabel: string;
  loading?: boolean;
  onBuyExtra: () => void;
}

export function CreditsBalanceHero({
  balance,
  planLabel,
  loading = false,
  onBuyExtra,
}: CreditsBalanceHeroProps) {
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
              {loading ? '…' : <CountUp value={balance} duration={0.7} />}
            </span>
            <span className="text-lg sm:text-xl font-medium text-gray-400">
              Credits
            </span>
          </div>

          <p className="mt-4 max-w-lg text-sm text-gray-400 leading-relaxed">
            <span className="font-semibold text-gray-200">{planLabel}</span> ·{' '}
            {loading
              ? 'Loading wallet…'
              : 'Each virtual human costs exactly 1 credit. Balance syncs from your ledger.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onBuyExtra}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-400 hover:shadow-orange-400/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
        >
          <CoinsIcon size={16} aria-hidden />
          Buy Credits
        </button>
      </div>
    </section>
  );
}
