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
  const { credits, loading, error: accountError } = useUserAccount();
  const creditsLabel = loading ? '…' : accountError ? '—' : credits.toLocaleString();

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
        <Link
          to="/app/credits"
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-2.5 sm:px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50/60"
          aria-label="View credits and billing"
        >
          <ZapIcon size={14} className="text-orange-500 shrink-0" aria-hidden />
          <span className="tabular-nums">{creditsLabel}</span>
          <span className="hidden min-[400px]:inline font-medium text-gray-500">Credits</span>
        </Link>

        <UserAccountMenu />
      </div>
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
    <UserAccountProvider>
      <ClerkAuthBridge />
      <AppShellSidebar>{children}</AppShellSidebar>
    </UserAccountProvider>
  );
}
