import React, { useState } from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { ConsoleHeader } from '../components/ui/ConsoleHeader';
import { SettingsTabNav } from '../components/settings/SettingsTabNav';
import { SettingsPlansPanel } from '../components/settings/SettingsPlansPanel';
import { SettingsProfilePanel } from '../components/settings/SettingsProfilePanel';
import { SettingsBillingPanel } from '../components/settings/SettingsBillingPanel';
import { settingsTabs, type SettingsTabId } from '../data/settings';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('plans');

  return (
    <PageContainer className="py-8 md:py-12">
      <ConsoleHeader
        breadcrumb="CONSOLE / SETTINGS"
        title="Settings"
        description="Manage your plan, profile, and billing."
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <aside className="md:col-span-3">
          <SettingsTabNav
            tabs={[...settingsTabs]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </aside>

        <div className="md:col-span-9 min-w-0">
          {activeTab === 'plans' && <SettingsPlansPanel />}
          {activeTab === 'profile' && <SettingsProfilePanel />}
          {activeTab === 'billing' && (
            <SettingsBillingPanel onChangePlan={setActiveTab} />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
