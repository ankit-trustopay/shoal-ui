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
  credits: number;
  plan: string;
}

export async function getUserAccount(): Promise<UserAccount> {
  const res = await apiFetch('/api/user/me');
  const data: unknown = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(
      parseErrorMessage(data, 'Failed to load wallet'),
      res.status,
    );
  }

  const body = data as UserAccount & ApiErrorBody;

  if (typeof body.credits !== 'number' || typeof body.plan !== 'string') {
    throw new ApiRequestError('Invalid account response', res.status);
  }

  return { credits: body.credits, plan: body.plan };
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
