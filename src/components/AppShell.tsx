import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserButton, useUser } from '@clerk/clerk-react';
import { easeOutExpo } from '../lib/motion';
import {
  SparklesIcon,
  HistoryIcon,
  CoinsIcon,
  SettingsIcon,
  BookOpenIcon,
  PlusIcon,
} from 'lucide-react';
import { FREE_TIER_AVAILABLE_CREDITS } from '../data/creditsBilling';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'New Swarm', path: '/app/new', icon: SparklesIcon },
  { name: 'History', path: '/app/history', icon: HistoryIcon },
  { name: 'Credits', path: '/app/credits', icon: CoinsIcon },
  { name: 'Settings', path: '/app/settings', icon: SettingsIcon },
];

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const { user } = useUser();
  const displayName =
    user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'Account';

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <aside className="w-64 shrink-0 bg-[#FAFAFA]/95 backdrop-blur-md border-r border-gray-200/60 flex flex-col">
        <div className="px-5 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-axiom text-white flex items-center justify-center text-sm font-bold">
              S
            </span>
            <span className="text-base font-bold text-black tracking-tight">
              Shoal AI
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app/new'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-orange-50 text-axiom' : 'text-gray-600 hover:text-black hover:bg-gray-100/60'}`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-200">
          <Link
            to="/product"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-black hover:bg-gray-100/60 transition-colors"
          >
            <BookOpenIcon size={16} />
            <span>About the product</span>
          </Link>
        </div>

        <div className="mt-auto px-4 py-4 border-t border-gray-200 bg-white/50">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-0.5">
                Free · {FREE_TIER_AVAILABLE_CREDITS} cr
              </p>
            </div>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </div>
          <Link
            to="/app/credits"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-axiom text-white px-3 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors"
          >
            <PlusIcon size={12} aria-hidden />
            Add credits
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">
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
