import type { SwarmStatus } from './api';

/**
 * Normalize API status (handles COMPLETED vs completed vs complete).
 */
export function normalizeDebateStatus(status: unknown): SwarmStatus | null {
  if (typeof status !== 'string' || !status.trim()) {
    return null;
  }

  const upper = status.trim().toUpperCase();

  if (upper === 'COMPLETED' || upper === 'COMPLETE') {
    return 'COMPLETED';
  }
  if (upper === 'RUNNING') {
    return 'RUNNING';
  }
  if (upper === 'PENDING') {
    return 'PENDING';
  }
  if (upper === 'FAILED' || upper === 'FAILURE') {
    return 'FAILED';
  }

  return null;
}

export function isDebateCompleted(
  status: unknown,
  resultData: unknown,
): boolean {
  if (normalizeDebateStatus(status) === 'COMPLETED') {
    return true;
  }

  if (!resultData || typeof resultData !== 'object' || Array.isArray(resultData)) {
    return false;
  }

  const record = resultData as Record<string, unknown>;
  const verdict =
    (typeof record.verdict === 'string' && record.verdict.trim()) ||
    (typeof record.consensus === 'string' && record.consensus.trim()) ||
    (typeof record.response === 'string' && record.response.trim()) ||
    '';

  return verdict.length > 0;
}

export function isDebateFailed(status: unknown): boolean {
  return normalizeDebateStatus(status) === 'FAILED';
}

/**
 * Live terminal only while deliberation is in flight — never when completed/failed.
 */
export function shouldShowLiveSimulation(
  status: unknown,
  resultData: unknown,
  loading: boolean,
  hasDebateRecord: boolean,
): boolean {
  if (isDebateCompleted(status, resultData) || isDebateFailed(status)) {
    return false;
  }

  const normalized = normalizeDebateStatus(status);
  if (normalized === 'PENDING' || normalized === 'RUNNING') {
    return true;
  }

  return loading && !hasDebateRecord;
}
