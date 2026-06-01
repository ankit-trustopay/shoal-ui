import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { PageContainer } from '../components/ui/PageContainer';
import { ConsoleHeader } from '../components/ui/ConsoleHeader';
import { CreditsBalanceHero } from '../components/credits/CreditsBalanceHero';
import { PricingTierCards } from '../components/credits/PricingTierCards';
import { BuyExtraCreditsPanel } from '../components/credits/BuyExtraCreditsPanel';
import { CreditsUsageTable } from '../components/credits/CreditsUsageTable';
import { HowCreditsWorkSection } from '../components/credits/HowCreditsWorkSection';
import { BentoCard } from '../components/ui/BentoCard';
import { useUserAccount } from '../hooks/useUserAccount';
import { formatPlanLabel } from '../lib/planLabels';
import { listSwarms, type SwarmHistoryListItem } from '../lib/api';
import type { BillingTier } from '../data/creditsBilling';

const WALLET_ERROR_FALLBACK = 'Failed to load wallet. Please refresh.';
const USAGE_ERROR_FALLBACK = 'Failed to load usage history. Please refresh.';

export function Credits() {
  const {
    credits,
    plan,
    planId,
    loading: accountLoading,
    error: accountError,
  } = useUserAccount();
  const [swarms, setSwarms] = useState<SwarmHistoryListItem[]>([]);
  const [usageLoading, setUsageLoading] = useState(true);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null);

  const walletErrorMessage =
    !accountLoading && accountError ? WALLET_ERROR_FALLBACK : null;

  const flashToast = useCallback((msg: string) => {
    setToast({ msg, key: Date.now() });
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const handleBuyCredits = useCallback(() => {
    flashToast('Credit purchases are coming soon.');
  }, [flashToast]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (accountLoading) {
        return;
      }

      setUsageLoading(true);
      setUsageError(null);

      try {
        const data = await listSwarms();
        if (!cancelled) {
          setSwarms(data);
        }
      } catch (err) {
        if (!cancelled) {
          setUsageError(
            err instanceof Error ? err.message : USAGE_ERROR_FALLBACK,
          );
          setSwarms([]);
        }
      } finally {
        if (!cancelled) {
          setUsageLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [accountLoading]);

  const handleUpgrade = (tier: BillingTier) => {
    flashToast(`${tier.name} checkout will open when billing is connected`);
  };

  return (
    <PageContainer width="wide" className="pb-16 pt-6 md:pt-8 relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-6 right-6 z-50 inline-flex items-center gap-2 bg-gray-900 text-white rounded-full pl-3 pr-4 py-2 shadow-lg"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <CheckIcon size={12} strokeWidth={3} aria-hidden />
            </span>
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ConsoleHeader
        breadcrumb="CONSOLE / CREDITS & BILLING"
        title="Credits & billing"
        description="Manage your compute balance, upgrade virtual human limits, and audit swarm credit usage."
        className="mb-8"
      />

      {walletErrorMessage && !accountLoading && (
        <BentoCard className="mb-6 rounded-2xl border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-800">{walletErrorMessage}</p>
        </BentoCard>
      )}

      <div className="mb-10 md:mb-12">
        <CreditsBalanceHero
          balance={credits}
          planLabel={formatPlanLabel(plan)}
          loading={accountLoading}
          error={walletErrorMessage}
          onBuyExtra={handleBuyCredits}
        />
      </div>

      <HowCreditsWorkSection />

      <div className="mb-10 md:mb-14">
        <PricingTierCards currentPlanId={planId} onUpgrade={handleUpgrade} />
      </div>

      <div className="mb-10 md:mb-14">
        <BuyExtraCreditsPanel onBuyCredits={handleBuyCredits} />
      </div>

      <section className="mb-4" aria-labelledby="recent-usage-heading">
        <h2
          id="recent-usage-heading"
          className="text-2xl font-bold text-black tracking-tight mb-1"
        >
          Recent usage
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          Credit draws from your latest swarms via the live API.
        </p>

        {usageError && !usageLoading && (
          <BentoCard className="mb-6 rounded-2xl border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-800">{usageError}</p>
          </BentoCard>
        )}

        <CreditsUsageTable swarms={swarms} loading={usageLoading} />
      </section>
    </PageContainer>
  );
}
