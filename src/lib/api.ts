const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

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
