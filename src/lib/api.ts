const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export { API_BASE };

async function getClerkSessionToken(): Promise<string | null> {
  try {
    const token = await window.Clerk?.session?.getToken();
    return token ?? null;
  } catch {
    return null;
  }
}

async function buildAuthHeaders(
  extra?: Record<string, string>,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };

  const token = await getClerkSessionToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export interface CreateSwarmPayload {
  premise: string;
  agentCount: number;
}

export interface CreateSwarmResponse {
  swarmId: string;
}

export type SwarmStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

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
  createdAt: string;
  messages?: SwarmMessageRecord[];
  evidence?: SwarmEvidenceRecord[];
}

export interface ApiErrorBody {
  error?: string;
}

export async function createSwarm(
  payload: CreateSwarmPayload,
): Promise<CreateSwarmResponse> {
  const res = await fetch(`${API_BASE}/api/swarms`, {
    method: "POST",
    headers: await buildAuthHeaders(),
    body: JSON.stringify({
      premise: payload.premise,
      agentCount: payload.agentCount,
    }),
  });

  const data = (await res.json()) as CreateSwarmResponse & ApiErrorBody;

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to start swarm");
  }

  if (!data.swarmId) {
    throw new Error("Server did not return a swarm id");
  }

  return { swarmId: data.swarmId };
}

export async function listSwarms(): Promise<SwarmHistoryListItem[]> {
  const res = await fetch(`${API_BASE}/api/swarms`, {
    headers: await buildAuthHeaders(),
  });
  const data: unknown = await res.json();

  if (!res.ok) {
    const body = data as ApiErrorBody;
    throw new Error(body.error ?? "Failed to load swarm history");
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid swarm history response");
  }

  return data as SwarmHistoryListItem[];
}

export async function getSwarm(swarmId: string): Promise<SwarmRecord> {
  const res = await fetch(
    `${API_BASE}/api/swarms/${encodeURIComponent(swarmId)}`,
    {
      headers: await buildAuthHeaders(),
    },
  );

  const data = (await res.json()) as SwarmRecord & ApiErrorBody;

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to load swarm");
  }

  if (!data.premise) {
    throw new Error("Swarm data is incomplete");
  }

  return data;
}
