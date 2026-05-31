import {
  CURRENT_BILLING_PLAN_ID,
  saasPlans,
  type SaasPlan,
} from './creditsBilling';

export { settingsTabs, type SettingsTabId } from './settingsTabs';

export type SettingsPlan = SaasPlan;

export const settingsPlans = saasPlans;

export const CURRENT_PLAN_ID = CURRENT_BILLING_PLAN_ID;

export { getCurrentSaasPlan as getCurrentPlan } from './creditsBilling';

export const settingsInvoices: {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: string;
}[] = [];
