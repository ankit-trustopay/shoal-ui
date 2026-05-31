const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export { API_BASE };

const DEFAULT_USER_ID =
  import.meta.env.VITE_DEFAULT_USER_ID ?? "test-user-001";

export interface CreateSwarmPayload {
  premise: string;
  agentCount: number;
  userId?: string;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: payload.userId ?? DEFAULT_USER_ID,
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

export async function getSwarm(swarmId: string): Promise<SwarmRecord> {
  const res = await fetch(
    `${API_BASE}/api/swarms/${encodeURIComponent(swarmId)}`,
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
