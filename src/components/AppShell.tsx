import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { easeOutExpo } from '../lib/motion';
import {
  SparklesIcon,
  HistoryIcon,
  CoinsIcon,
  SettingsIcon,
  BookOpenIcon,
  LogOutIcon,
  PlusIcon,
  ZapIcon,
  RocketIcon,
  CrownIcon,
  Building2Icon,
  LockIcon } from
'lucide-react';
interface AppShellProps {
  children: React.ReactNode;
}
const navItems = [
{
  name: 'New Swarm',
  path: '/app/new',
  icon: SparklesIcon
},
{
  name: 'History',
  path: '/app/history',
  icon: HistoryIcon
},
{
  name: 'Credits',
  path: '/app/credits',
  icon: CoinsIcon
},
{
  name: 'Settings',
  path: '/app/settings',
  icon: SettingsIcon
}];

// User state (mock)
const currentUser = {
  name: 'Ankit',
  email: 'ankit.trustopay@gmail.com',
  initial: 'A',
  plan: 'Free' as 'Free' | 'Lite' | 'Starter' | 'Pro' | 'Max',
  credits: 10
};
const planRank: Record<string, number> = {
  Free: 0,
  Lite: 0,
  Starter: 1,
  Pro: 2,
  Max: 3
};
const swarmQuotas = [
{
  name: 'Lite',
  icon: ZapIcon,
  required: 'Lite',
  used: 2,
  total: 5
},
{
  name: 'Starter',
  icon: RocketIcon,
  required: 'Starter',
  used: 1,
  total: 5
},
{
  name: 'Pro',
  icon: CrownIcon,
  required: 'Pro',
  used: 0,
  total: 5
},
{
  name: 'Max',
  icon: Building2Icon,
  required: 'Max',
  used: 0,
  total: 5
}];

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-axiom text-white flex items-center justify-center text-sm font-bold hover:opacity-90 transition-opacity"
        aria-label="Account menu">
        
        {currentUser.initial}
      </button>

      {open &&
      <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-bento-hover z-30 overflow-hidden">
          {/* Profile header */}
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {currentUser.initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-black truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {currentUser.email}
              </div>
            </div>
          </div>

          {/* Plan + credits */}
          <div className="px-4 py-4 border-b border-gray-100 bg-orange-50/40">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {currentUser.plan} Plan
              </span>
              <Link
              to="/app/settings"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-axiom hover:underline">
              
                Manage plan
              </Link>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-0.5">
                  Credits
                </div>
                <div className="text-2xl font-bold text-black tracking-tighter leading-none">
                  {currentUser.credits.toLocaleString()}
                </div>
              </div>
              <Link
              to="/app/credits"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 bg-axiom text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-orange-600 transition-colors">
              
                <PlusIcon size={12} />
                Add credits
              </Link>
            </div>
          </div>

          {/* Daily swarm quotas */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Daily quota
            </div>
            <div className="space-y-1.5">
              {swarmQuotas.map((q) => {
              const Icon = q.icon;
              const accessible =
              planRank[q.required] <= planRank[currentUser.plan];
              const left = q.total - q.used;
              return (
                <div
                  key={q.name}
                  className={`flex items-center justify-between gap-3 py-1 ${accessible ? '' : 'opacity-50'}`}>
                  
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                      size={13}
                      className={accessible ? 'text-axiom' : 'text-gray-400'} />
                    
                      <span className="text-sm text-black">{q.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-gray-600 tracking-wide flex items-center gap-1">
                      {accessible ?
                    <>
                          <span className="text-black font-semibold">
                            {left}
                          </span>
                          <span className="text-gray-400">
                            of {q.total} left
                          </span>
                        </> :

                    <span className="inline-flex items-center gap-1 text-gray-400">
                          <LockIcon size={10} />
                          Locked
                        </span>
                    }
                    </span>
                  </div>);

            })}
            </div>
          </div>

          {/* Logout */}
          <div className="py-1">
            <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            
              <LogOutIcon size={15} className="text-gray-400" />
              Log out
            </Link>
          </div>
        </div>
      }
    </div>);

}
export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
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
                }>
                
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>);

          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-200">
          <Link
            to="/product"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-black hover:bg-gray-100/60 transition-colors">
            
            <BookOpenIcon size={16} />
            <span>About the product</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">
        <header className="glass-sticky flex items-center justify-end px-4 sm:px-8 py-4 shrink-0 border-b">
          <UserMenu />
        </header>

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
    </div>);

}