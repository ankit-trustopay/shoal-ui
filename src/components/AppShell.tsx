import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SparklesIcon,
  HistoryIcon,
  CoinsIcon,
  SettingsIcon,
  ZapIcon,
  MenuIcon,
} from 'lucide-react';
import { easeOutExpo } from '../lib/motion';
import { UserAccountProvider, useUserAccount } from '../hooks/useUserAccount';
import { ClerkAuthBridge } from './auth/ClerkAuthBridge';
import { AppSidebarNav } from './AppSidebarNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { UserAccountMenu } from './UserAccountMenu';
import { ConsoleToast, useConsoleToast } from './ui/ConsoleToast';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'New Swarm', path: '/app/new', icon: SparklesIcon },
  { name: 'History', path: '/app/history', icon: HistoryIcon },
  { name: 'Credits', path: '/app/credits', icon: CoinsIcon },
  { name: 'Settings', path: '/app/settings', icon: SettingsIcon },
];

function ConsoleTopHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { loading, error: accountError, user, totalCredits } = useUserAccount();
  const { toastMessage, showToast } = useConsoleToast();

  return (
    <header className="glass-sticky flex shrink-0 items-center justify-between gap-3 border-b border-gray-200/60 bg-[#FAFAFA]/95 px-4 sm:px-8 py-3 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <MenuIcon size={22} aria-hidden />
        </button>
        <Link
          to="/app/new"
          className="flex items-center gap-2 md:hidden min-w-0"
          aria-label="Shoal AI home"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-axiom text-sm font-bold text-white">
            S
          </span>
          <span className="truncate text-sm font-bold tracking-tight text-black">
            Shoal AI
          </span>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="relative">
          <Link
            to="/app/credits"
            className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-2.5 sm:px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:border-gray-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
            aria-label="View credits and billing"
          >
            <ZapIcon size={14} className="text-orange-500 shrink-0" aria-hidden />
            {loading ? (
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"
                aria-label="Loading credits"
              />
            ) : (
              <span className="tabular-nums whitespace-nowrap">
                {accountError ? '—' : `${totalCredits.toLocaleString()} Credits`}
              </span>
            )}

            {/* Premium hover popover */}
            <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden w-64 translate-y-1 opacity-0 transition-all duration-150 group-hover:block group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:block">
              <div className="rounded-md border bg-white p-3 shadow-xl">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Wallet
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-3">
                      <span
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"
                        aria-label="Loading wallet"
                      />
                    </div>
                  ) : (
                    <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">
                        Daily Free
                      </div>
                      <div className="text-xs text-gray-500">
                        Resets at midnight
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                      {`${user?.dailyCredits || 0} / 150`}
                    </div>
                  </div>

                  <div className="h-px bg-gray-200/70" />

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-gray-900">Vault</div>
                    <div className="text-sm font-semibold tabular-nums text-gray-900">
                      {`${user?.vaultCredits || 0}`}
                    </div>
                  </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Credit purchases are coming soon.');
                    }}
                    className="pointer-events-auto mt-2 inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 active:bg-orange-600"
                  >
                    Buy Credits
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <UserAccountMenu />
      </div>

      <ConsoleToast message={toastMessage} />
    </header>
  );
}

function AppShellSidebar({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-0 w-full bg-[#FAFAFA]">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-200/60 bg-[#FAFAFA]/95 backdrop-blur-md">
        <AppSidebarNav items={navItems} />
      </aside>

      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        items={navItems}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#FAFAFA] w-full">
        <ConsoleTopHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.38, ease: easeOutExpo }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <ClerkAuthBridge />
      <UserAccountProvider>
        <AppShellSidebar>{children}</AppShellSidebar>
      </UserAccountProvider>
    </>
  );
}
