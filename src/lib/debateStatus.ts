import type { SwarmStatus } from './api';

export type DebateUiPhase =
  | 'loading'
  | 'in_progress'
  | 'completed'
  | 'failed';

/**
 * Normalize API status (COMPLETED, completed, in_progress, RUNNING, etc.).
 */
export function normalizeDebateStatus(status: unknown): SwarmStatus | null {
  if (typeof status !== 'string' || !status.trim()) {
    return null;
  }

  const lower = status.trim().toLowerCase();
  const upper = lower.toUpperCase();

  if (
    upper === 'COMPLETED' ||
    upper === 'COMPLETE' ||
    lower === 'completed'
  ) {
    return 'COMPLETED';
  }
  if (
    upper === 'RUNNING' ||
    lower === 'in_progress' ||
    lower === 'in-progress' ||
    lower === 'deliberating'
  ) {
    return 'RUNNING';
  }
  if (upper === 'PENDING' || lower === 'pending') {
    return 'PENDING';
  }
  if (
    upper === 'FAILED' ||
    upper === 'FAILURE' ||
    lower === 'failed'
  ) {
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
 * True while deliberation is active — never true when completed/failed.
 */
export function isDebateInProgress(
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

export function resolveDebateUiPhase(
  status: unknown,
  resultData: unknown,
  loading: boolean,
  hasDebateRecord: boolean,
): DebateUiPhase {
  if (isDebateCompleted(status, resultData)) {
    return 'completed';
  }
  if (isDebateFailed(status)) {
    return 'failed';
  }
  if (isDebateInProgress(status, resultData, loading, hasDebateRecord)) {
    return 'in_progress';
  }
  return 'loading';
}

/** @deprecated use isDebateInProgress */
export function shouldShowLiveSimulation(
  status: unknown,
  resultData: unknown,
  loading: boolean,
  hasDebateRecord: boolean,
): boolean {
  return isDebateInProgress(status, resultData, loading, hasDebateRecord);
}
