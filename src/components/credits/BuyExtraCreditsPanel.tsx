import React, { useMemo, useState } from 'react';
import { CreditCard, CoinsIcon, SparklesIcon } from 'lucide-react';
import { MonoLabel } from '../ui/MonoLabel';

interface BuyExtraCreditsPanelProps {
  onBuyCredits?: () => void;
}

export function BuyExtraCreditsPanel({ onBuyCredits }: BuyExtraCreditsPanelProps) {
  const [usd, setUsd] = useState(25);

  const clampedUsd = useMemo(() => {
    const safe = Number.isFinite(usd) ? usd : 5;
    return Math.min(100, Math.max(5, Math.round(safe)));
  }, [usd]);

  const credits = useMemo(() => clampedUsd * 200, [clampedUsd]);

  return (
    <section
      id="buy-extra-credits"
      className="scroll-mt-8 rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-bento"
    >
      <MonoLabel className="mb-2 block">Top-up</MonoLabel>
      <h2 className="text-xl font-bold text-black tracking-tight mb-1">
        Custom Top-Up Calculator
      </h2>
      <p className="text-sm text-gray-600 mb-6 max-w-xl">
        Choose any amount between $5–$100. Exchange rate: $1 = 200 credits.
      </p>

      <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-br from-gray-50/60 to-white p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <label className="block w-full sm:max-w-xs">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Dollar amount (min $5)
              </span>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/25">
                <span className="text-sm font-semibold text-gray-500">$</span>
                <input
                  type="number"
                  min={5}
                  value={usd}
                  onChange={(e) => setUsd(Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 tabular-nums focus:outline-none"
                  inputMode="numeric"
                />
              </div>
            </label>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                <SparklesIcon size={14} className="text-orange-600" aria-hidden />
                Instant calculation
              </span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Top-up slider
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums text-gray-700">
                ${clampedUsd} → {credits.toLocaleString()} credits
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={clampedUsd}
              onChange={(e) => setUsd(Number(e.target.value))}
              className="w-full h-1.5 accent-orange-500 cursor-pointer"
            />
          </div>

          <div className="rounded-xl border border-gray-200/70 bg-white px-4 py-3">
            <p className="text-sm text-gray-700">
              For{' '}
              <span className="font-semibold tabular-nums text-gray-900">
                ${clampedUsd}
              </span>
              , you will receive{' '}
              <span className="font-semibold tabular-nums text-gray-900">
                {credits.toLocaleString()}
              </span>{' '}
              Credits.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Credits are added to your vault after successful payment.
            </p>
          </div>

          <button
            type="button"
            onClick={onBuyCredits}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black"
          >
            <CreditCard size={16} aria-hidden />
            Pay ${clampedUsd} with Stripe
          </button>

          <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <CoinsIcon size={14} className="text-gray-400" aria-hidden />
              $1 = 200 Credits
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Secure checkout
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
