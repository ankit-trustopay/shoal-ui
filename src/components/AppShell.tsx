import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
import { easeOutExpo } from '../lib/motion';
import {
  SparklesIcon,
  HistoryIcon,
  CoinsIcon,
  SettingsIcon,
  BookOpenIcon,
  ZapIcon,
} from 'lucide-react';
import { UserAccountProvider, useUserAccount } from '../hooks/useUserAccount';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'New Swarm', path: '/app/new', icon: SparklesIcon },
  { name: 'History', path: '/app/history', icon: HistoryIcon },
  { name: 'Credits', path: '/app/credits', icon: CoinsIcon },
  { name: 'Settings', path: '/app/settings', icon: SettingsIcon },
];

function ConsoleTopHeader() {
  const { credits, loading } = useUserAccount();
  const creditsLabel = loading ? '…' : credits.toLocaleString();

  return (
    <header className="glass-sticky flex shrink-0 items-center justify-end gap-3 border-b border-gray-200/60 bg-[#FAFAFA]/95 px-4 sm:px-8 py-3 backdrop-blur-md">
      <Link
        to="/app/credits"
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50/60"
        aria-label="View credits and billing"
      >
        <ZapIcon size={14} className="text-orange-500 shrink-0" aria-hidden />
        <span className="tabular-nums">{creditsLabel}</span>
        <span className="font-medium text-gray-500">Credits</span>
      </Link>

      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'w-9 h-9 ring-2 ring-white shadow-sm',
          },
        }}
      />
    </header>
  );
}

function AppShellSidebar({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200/60 bg-[#FAFAFA]/95 backdrop-blur-md">
        <div className="px-5 py-6">
          <Link to="/app/new" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-axiom text-sm font-bold text-white">
              S
            </span>
            <span className="text-base font-bold tracking-tight text-black">
              Shoal AI
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app/new'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-orange-50 text-axiom' : 'text-gray-600 hover:bg-gray-100/60 hover:text-black'}`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-200 px-3 py-4">
          <Link
            to="/product"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100/60 hover:text-black"
          >
            <BookOpenIcon size={16} />
            <span>About the product</span>
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden bg-[#FAFAFA]">
        <ConsoleTopHeader />

        <main className="flex-1 overflow-y-auto">
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
      <AppShellSidebar>{children}</AppShellSidebar>
    </UserAccountProvider>
  );
}
