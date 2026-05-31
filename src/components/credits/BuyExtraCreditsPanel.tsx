import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MonoLabel } from '../ui/MonoLabel';
import { creditTopUpPacks } from '../../data/creditsBilling';

interface BuyExtraCreditsPanelProps {
  onPurchase?: (credits: number) => void;
}

export function BuyExtraCreditsPanel({ onPurchase }: BuyExtraCreditsPanelProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const purchase = (packId: string, credits: number) => {
    setPendingId(packId);
    onPurchase?.(credits);
    window.setTimeout(() => setPendingId(null), 500);
  };

  return (
    <section
      id="buy-extra-credits"
      className="scroll-mt-8 rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-bento"
    >
      <MonoLabel className="mb-2 block">Top-up</MonoLabel>
      <h2 className="text-xl font-bold text-black tracking-tight mb-1">
        Buy extra credits
      </h2>
      <p className="text-sm text-gray-600 mb-6 max-w-xl">
        One-time packs add to your balance instantly. Credits never expire.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {creditTopUpPacks.map((pack, index) => {
          const isPending = pendingId === pack.id;
          const isPopular = index === 1;

          return (
            <motion.div
              key={pack.id}
              whileHover={{ y: -2 }}
              className={`relative rounded-xl border p-5 ${
                isPopular
                  ? 'border-orange-500 bg-orange-50/50'
                  : 'border-gray-200 bg-gray-50/30'
              }`}
            >
              {isPopular && (
                <span className="absolute -top-2.5 left-4 font-mono text-[9px] font-semibold uppercase tracking-widest bg-orange-500 text-white px-2 py-0.5 rounded">
                  Best value
                </span>
              )}
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                {pack.label}
              </p>
              <p className="text-2xl font-bold text-black tracking-tighter tabular-nums">
                {pack.credits.toLocaleString()}
                <span className="text-sm font-medium text-gray-500 ml-1">cr</span>
              </p>
              <p className="text-sm text-gray-600 mt-1 mb-4">${pack.price}</p>
              <button
                type="button"
                disabled={isPending}
                onClick={() => purchase(pack.id, pack.credits)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-black transition-colors disabled:opacity-60"
              >
                <PlusIcon size={14} aria-hidden />
                {isPending ? 'Processing…' : 'Add to balance'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
