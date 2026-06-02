import { resolveAuthToken } from './auth-token';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

const API_TIMEOUT_MS = 25_000;

export { API_BASE };

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export interface ApiErrorBody {
  error?: string;
  message?: string;
}

async function buildAuthHeaders(
  extra?: Record<string, string>,
): Promise<Record<string, string>> {
  const token = await resolveAuthToken();

  if (!token) {
    throw new ApiRequestError(
      'Your session is not ready. Please refresh the page.',
      401,
    );
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

function parseErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const body = data as ApiErrorBody;
    if (typeof body.message === 'string' && body.message.trim()) {
      return body.message.trim();
    }
    if (typeof body.error === 'string' && body.error.trim()) {
      return body.error.trim();
    }
  }
  return fallback;
}

async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = await buildAuthHeaders(
    init.headers as Record<string, string> | undefined,
  );

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...headers,
        ...(init.headers as Record<string, string> | undefined),
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError(
        'The request timed out. Please check your connection and refresh.',
        0,
      );
    }
    throw new ApiRequestError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export interface CreateSwarmPayload {
  premise: string;
  agentCount: number;
  model: string;
}

export interface CreateSwarmResponse {
  swarmId: string;
}

export interface CreateDebatePayload {
  query: string;
  agentCount: number;
  modelTier: 'lite' | 'plus';
  advancedVariables: {
    targetAudience?: string;
    pricePoint?: string;
    marketingBudget?: string;
  };
}

export interface CreateDebateResponse {
  debateId: string;
}

export type SwarmStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface SwarmMessageRecord {
  id: string;
  swarmId: string;
  text: string;
  role: string;
  createdAt: string;
}

export interface SwarmEvidenceRecord {
  id: string;
  swarmId: string;
  title: string;
  source: string;
  url: string;
  snippet: string;
}

/** Lightweight row from GET /api/swarms */
export interface SwarmHistoryListItem {
  id: string;
  premise: string;
  confidence: number | null;
  status: SwarmStatus;
  createdAt: string;
  agentCount: number | null;
  cost: number | null;
  runtime: number | null;
}

export interface DebateUsageListItem {
  id: string;
  createdAt: string;
  premise: string;
  agentCount: number;
  model: string | null;
  creditsConsumed: number;
}

export interface SwarmRecord {
  id: string;
  userId: string;
  premise: string;
  status: SwarmStatus;
  agentCount: number;
  resultData: unknown;
  confidence?: number | null;
  votesFor?: number | null;
  votesAgainst?: number | null;
  votesNeutral?: number | null;
  runtime?: number | null;
  cost?: number | null;
  agentProfiles?: unknown;
  debateTranscript?: unknown;
  createdAt: string;
  messages?: SwarmMessageRecord[];
  evidence?: SwarmEvidenceRecord[];
}

export interface UserAccount {
  dailyCredits: number;
  vaultCredits: number;
  plan: string;
}

function parseWalletNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }
  return null;
}

function parseUserAccountPayload(data: unknown): UserAccount {
  if (!data || typeof data !== 'object') {
    throw new ApiRequestError('Invalid account response');
  }

  const body = data as Record<string, unknown>;

  let dailyCredits =
    parseWalletNumber(body.dailyCredits) ??
    parseWalletNumber(body.daily_credits);
  let vaultCredits =
    parseWalletNumber(body.vaultCredits) ??
    parseWalletNumber(body.vault_credits) ??
    0;

  // Legacy API: single `credits` field maps to daily wallet.
  const legacyCredits = parseWalletNumber(body.credits);
  if (dailyCredits === null && legacyCredits !== null) {
    dailyCredits = legacyCredits;
  }

  if (dailyCredits === null) {
    dailyCredits = 0;
  }

  const plan =
    typeof body.plan === 'string' && body.plan.trim()
      ? body.plan.trim()
      : 'FREE';

  return {
    dailyCredits,
    vaultCredits,
    plan,
  };
}

export async function getUserAccount(options?: {
  getToken?: () => Promise<string | null>;
}): Promise<UserAccount> {
  const token = options?.getToken
    ? await options.getToken()
    : await resolveAuthToken();

  if (!token) {
    throw new ApiRequestError(
      'Your session is not ready. Please refresh the page.',
      401,
    );
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/user/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError(
        'The request timed out. Please check your connection and refresh.',
        0,
      );
    }
    throw new ApiRequestError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to load wallet'),
      res.status,
    );
  }

  return parseUserAccountPayload(data);
}

export async function createSwarm(
  payload: CreateSwarmPayload,
): Promise<CreateSwarmResponse> {
  const res = await apiFetch('/api/swarms', {
    method: 'POST',
    body: JSON.stringify({
      premise: payload.premise,
      agentCount: payload.agentCount,
      model: payload.model,
    }),
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to start swarm'),
      res.status,
    );
  }

  const body = data as CreateSwarmResponse & ApiErrorBody;

  if (!body.swarmId) {
    throw new ApiRequestError('Server did not return a swarm id', res.status);
  }

  return { swarmId: body.swarmId };
}

export async function createDebate(
  payload: CreateDebatePayload,
): Promise<CreateDebateResponse> {
  const res = await apiFetch('/api/debates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to start debate'),
      res.status,
    );
  }

  const body = data as CreateDebateResponse & ApiErrorBody;

  if (typeof body.debateId !== 'string' || !body.debateId.trim()) {
    throw new ApiRequestError('Server did not return a debateId', res.status);
  }

  return { debateId: body.debateId.trim() };
}

export async function listSwarms(): Promise<SwarmHistoryListItem[]> {
  const res = await apiFetch('/api/swarms');
  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to load swarm history'),
      res.status,
    );
  }

  if (!Array.isArray(data)) {
    throw new ApiRequestError('Invalid swarm history response', res.status);
  }

  return data as SwarmHistoryListItem[];
}

export async function listDebates(): Promise<DebateUsageListItem[]> {
  const res = await apiFetch('/api/debates');
  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to load usage history'),
      res.status,
    );
  }

  if (!Array.isArray(data)) {
    throw new ApiRequestError('Invalid usage history response', res.status);
  }

  return data as DebateUsageListItem[];
}

export async function getSwarm(swarmId: string): Promise<SwarmRecord> {
  const res = await apiFetch(`/api/swarms/${encodeURIComponent(swarmId)}`);
  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to load swarm'),
      res.status,
    );
  }

  const body = data as SwarmRecord & ApiErrorBody;

  if (!body.premise) {
    throw new ApiRequestError('Swarm data is incomplete', res.status);
  }

  return body;
}

export async function getDebate(debateId: string): Promise<SwarmRecord> {
  const res = await apiFetch(`/api/debates/${encodeURIComponent(debateId)}`);
  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to load debate'),
      res.status,
    );
  }

  const body = data as SwarmRecord & ApiErrorBody;

  if (!body.premise) {
    throw new ApiRequestError('Debate data is incomplete', res.status);
  }

  return body;
}
