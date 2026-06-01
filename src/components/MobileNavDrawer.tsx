import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenIcon, XIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MobileNavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
}

export function MobileNavDrawer({ open, onClose, items }: MobileNavDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close navigation menu"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            className="relative flex h-full w-[min(100%,17rem)] flex-col border-r border-gray-200/60 bg-[#FAFAFA] shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200/60">
              <Link
                to="/app/new"
                onClick={onClose}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-axiom text-sm font-bold text-white">
                  S
                </span>
                <span className="text-base font-bold tracking-tight text-black">
                  Shoal AI
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <XIcon size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/app/new'}
                    onClick={onClose}
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

            <div className="border-t border-gray-200 px-3 py-4">
              <Link
                to="/product"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100/60 hover:text-black"
              >
                <BookOpenIcon size={16} />
                <span>About the product</span>
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
