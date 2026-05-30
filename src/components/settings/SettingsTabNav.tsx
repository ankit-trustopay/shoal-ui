import React from 'react';
import type { SettingsTabId } from '../../data/settings';
import { cn } from '../../lib/cn';

interface Tab {
  id: SettingsTabId;
  label: string;
}

interface SettingsTabNavProps {
  tabs: Tab[];
  activeTab: SettingsTabId;
  onTabChange: (id: SettingsTabId) => void;
}

export function SettingsTabNav({
  tabs,
  activeTab,
  onTabChange,
}: SettingsTabNavProps) {
  return (
    <nav className="space-y-1 md:sticky md:top-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-gray-100 text-black font-semibold'
                : 'text-gray-500 hover:text-black hover:bg-gray-50',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
