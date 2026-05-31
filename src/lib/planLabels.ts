import type { SaasPlanId } from '../data/creditsBilling';
import { saasPlans } from '../data/creditsBilling';

/** Map backend plan string (e.g. "FREE") to SaaS tier id. */
export function normalizePlanId(plan: string): SaasPlanId {
  const normalized = plan.trim().toLowerCase() as SaasPlanId;
  if (saasPlans.some((tier) => tier.id === normalized)) {
    return normalized;
  }
  return 'free';
}

export function formatPlanLabel(plan: string): string {
  const id = normalizePlanId(plan);
  if (id === 'free') return 'Free Plan';
  const tier = saasPlans.find((item) => item.id === id);
  return tier?.name ?? plan;
}

export function formatPlanTierLabel(plan: string): string {
  const id = normalizePlanId(plan);
  if (id === 'free') return 'Free Tier';
  const tier = saasPlans.find((item) => item.id === id);
  return tier?.name ?? plan;
}
