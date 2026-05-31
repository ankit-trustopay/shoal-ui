export const settingsTabs = [
  { id: 'plans', label: 'Plans' },
  { id: 'profile', label: 'Profile' },
  { id: 'billing', label: 'Billing & Usage' },
] as const;

export type SettingsTabId = (typeof settingsTabs)[number]['id'];
