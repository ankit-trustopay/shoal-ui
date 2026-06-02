import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SparklesIcon,
  HistoryIcon,
  CoinsIcon,
  SettingsIcon,
  MenuIcon,
} from 'lucide-react';
import { easeOutExpo } from '../lib/motion';
import { UserAccountProvider } from '../hooks/useUserAccount';
import { ClerkAuthBridge } from './auth/ClerkAuthBridge';
import { AppSidebarNav } from './AppSidebarNav';
import { MobileNavDrawer } from './MobileNavDrawer';
import { UserAccountMenu } from './UserAccountMenu';
import { WalletCreditsMenu } from './WalletCreditsMenu';
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
  return (
    <header className="relative z-50 flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-[#FAFAFA] px-4 py-3 shadow-sm sm:px-8">
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
          className="flex min-w-0 items-center gap-2 md:hidden"
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

      <div className="relative z-50 flex shrink-0 items-center gap-2 sm:gap-3">
        <WalletCreditsMenu />
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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200/60 bg-[#FAFAFA] md:flex">
        <AppSidebarNav items={navItems} />
      </aside>

      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        items={navItems}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#FAFAFA]">
        <ConsoleTopHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="relative z-0 flex-1 overflow-x-hidden overflow-y-auto">
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
