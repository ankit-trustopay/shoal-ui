import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpenIcon } from 'lucide-react';
import type { MobileNavItem } from './MobileNavDrawer';

interface AppSidebarNavProps {
  items: MobileNavItem[];
  className?: string;
}

export function AppSidebarNav({ items, className = '' }: AppSidebarNavProps) {
  return (
    <>
      <div className={`px-5 py-6 ${className}`}>
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
        {items.map((item) => {
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
    </>
  );
}
